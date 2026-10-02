from rest_framework import viewsets, status
from .models import MeetingNote
from .serializers import MeetingNoteSerializer
from .service import generate_meeting_summary
import threading
from django.db import transaction
from rest_framework.decorators import action
from rest_framework.response import Response


def process_summary_in_thread(note_id):
    try:
        note = MeetingNote.objects.get(id=note_id)
        note.summary = generate_meeting_summary(note.raw_text)
        note.save()
    except Exception as e:
        print(e)


class MeetingNoteViewSet(viewsets.ModelViewSet):
    queryset = MeetingNote.objects.all()
    serializer_class = MeetingNoteSerializer

    def perform_create(self, serializer):
        # 1. Save note instantly with processing status
        instance = serializer.save(
            summary={
                "status": "processing",
                "message": "Summary generation in progress...",
            }
        )

        # 2. Spawn a thread to fetch summary from Gemini in background
        transaction.on_commit(
            lambda: threading.Thread(
                target=process_summary_in_thread, args=(instance.id,), daemon=True
            ).start()
        )

    @action(detail=True, methods=["post"], url_path="regenerate")
    def regenerate_summary(self, request, pk=None):
        note = self.get_object()

        # Reset summary status and switch model status back to pending
        note.summary = {"status": "processing", "message": "Regenerating summary..."}
        note.status = "pending"
        note.save(update_fields=["summary", "status"])

        # Trigger background processing after DB commit
        transaction.on_commit(
            lambda: threading.Thread(
                target=process_summary_in_thread, args=(note.id,), daemon=True
            ).start()
        )

        return Response(
            {
                "detail": "Summary regeneration started.",
                "data": MeetingNoteSerializer(note).data,
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=["post"], url_path="verify")
    def verify(self, request, pk=None):
        note = self.get_object()
        note.status = "verified"
        note.save(update_fields=["status"])

        return Response(
            {
                "detail": "Meeting note verified successfully.",
                "data": MeetingNoteSerializer(note).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        note = self.get_object()
        note.status = "rejected"
        note.save(update_fields=["status"])

        return Response(
            {
                "detail": "Meeting note rejected.",
                "data": MeetingNoteSerializer(note).data,
            },
            status=status.HTTP_200_OK,
        )

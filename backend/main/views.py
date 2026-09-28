from rest_framework import viewsets
from .models import MeetingNote
from .serializers import MeetingNoteSerializer
from .service import generate_meeting_summary
import threading
from django.db import transaction

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
            summary={"status": "processing", "message": "Summary generation in progress..."}
        )

        # 2. Spawn a thread to fetch summary from Gemini in background
        transaction.on_commit(
            lambda: threading.Thread(
                target=process_summary_in_thread,
                args=(instance.id,),
                daemon=True
            ).start()
        )
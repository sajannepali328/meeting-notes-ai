import time
from django.test import TransactionTestCase
from rest_framework.test import APIClient
from .models import MeetingNote


class MeetingNoteRealAPITest(TransactionTestCase):

    def test_create_note_real_gemini_response(self):
        client = APIClient()
        test_user_input = "During today's Q3 product review, the team agreed to shift our main launch date to October 15th."

        response = client.post(
            "/api/notes/", {"raw_text": test_user_input}, format="json"
        )

        self.assertEqual(response.status_code, 201)

        note = MeetingNote.objects.first()
        self.assertEqual(note.summary["status"], "processing")

        # Poll database up to 10 seconds waiting for daemon thread completion
        max_retries = 10
        for _ in range(max_retries):
            time.sleep(1)
            note.refresh_from_db()
            if note.summary.get("status") != "processing":
                break

        # Assert status updated from processing
        self.assertNotEqual(note.summary.get("status"), "processing")
from django.db import models

STATUS_CHOICES = (
    ('pending', 'Pending Verification'),
    ('verified', 'Verified'),
    ('rejected', 'Rejected'),
)

class MeetingNote(models.Model):
    raw_text = models.TextField(help_text="Original meeting notes sent from frontend")
    summary = models.JSONField(blank=True, null=True, help_text="Generated summary stored as JSON")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Status indicating if human verification is needed"
    )

    def __str__(self):
        return f"Meeting Note {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
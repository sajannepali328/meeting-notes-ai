from rest_framework import serializers
from .models import MeetingNote

class MeetingNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingNote
        fields = ['id', 'raw_text', 'summary', 'created_at']
        read_only_fields = ['id', 'created_at']
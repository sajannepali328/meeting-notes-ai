from rest_framework import serializers
from .models import MeetingNote

class MeetingNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingNote
        fields = '__all__'
from django.contrib import admin
from .models import MeetingNote

@admin.register(MeetingNote)
class MeetingNoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'short_text', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('raw_text',)
    readonly_fields = ('created_at',)

    def short_text(self, obj):
        return obj.raw_text[:50] + "..." if len(obj.raw_text) > 50 else obj.raw_text
    short_text.short_description = "Raw Text"
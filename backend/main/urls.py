from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeetingNoteViewSet

router = DefaultRouter()
router.register(r'notes', MeetingNoteViewSet, basename='meetingnote')

urlpatterns = [
    path('', include(router.urls)),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, current_user, register

#1. Initialize the router
router = DefaultRouter()
router.register('posts', PostViewSet, basename='post') # Register the PostViewSet with the router
router.register('comments', CommentViewSet, basename='comment') # Register the CommentViewSet with the router

#2. Define URL patterns
urlpatterns = [
    path('', include(router.urls)), # Include the router URLs
    path('register/', register, name='register'), # Endpoint for user registration
    path('user/', current_user, name='current_user'), # Endpoint to get current
]
from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    # Use the local UserSerializer for the author
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at']
        # Do NOT include 'post' here to avoid recursive loops
        read_only_fields = ['id', 'author', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    # We remove 'comments' from here for now to ensure the 500 error stops
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'image', 'published', 'created_at', 'comments_count']
        read_only_fields = ['author', 'comments_count', 'created_at']

    def get_comments_count(self, obj):
        return obj.comments.count()
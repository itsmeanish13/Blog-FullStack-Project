from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, UserSerializer



# --- Custom Permissions ---
class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow anyone to see (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only authors can edit or delete
        return obj.author == request.user

# --- Post ViewSet ---
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    # Allows reading for anyone, but writing only for logged-in users
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
    def get_queryset(self):
        # Authenticated users see their own drafts + all published posts
        if self.request.user.is_authenticated:
            return Post.objects.filter(author=self.request.user) | Post.objects.filter(published=True)
        return Post.objects.filter(published=True)

    # ONE clean action for comments
    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def comments(self, request, pk=None):
        # 1. Manually get the post to ensure we don't trigger a 500 error here
        post = get_object_or_404(Post, pk=pk)

        if request.method == 'GET':
            try:
                # 2. Get comments directly from the Comment model
                comments = Comment.objects.filter(post=post).order_by('-created_at')
                serializer = CommentSerializer(comments, many=True)
                return Response(serializer.data)
            except Exception as e:
                return Response({"error": str(e)}, status=500)

        if request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                # 3. Explicitly save with author and post
                serializer.save(author=request.user, post=post)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

# --- Comment ViewSet (For direct updates/deletes) ---
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# --- Authentication Helpers ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
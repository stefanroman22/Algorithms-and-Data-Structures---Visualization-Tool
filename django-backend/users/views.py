from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "User registered successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "points": user.points,
                "profile_photo": user.profile_photo.url if user.profile_photo else None,
                "completed_quizzes": user.completed_quizzes,  # Assuming this is a list
                "rank": "Gold" if user.points >= 3000 else "Silver" if user.points >= 1000 else "Bronze",
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "points": user.points,
                "profile_photo": user.profile_photo.url if user.profile_photo else None,
                "completed_quizzes": user.completed_quizzes,  # Assuming this is a list
                "rank": "Gold" if user.points >= 3000 else "Silver" if user.points >= 1000 else "Bronze",
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

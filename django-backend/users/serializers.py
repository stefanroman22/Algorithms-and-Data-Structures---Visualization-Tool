from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username']

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Username cannot be empty.")

        if len(value) < 6 or len(value) > 20:
            raise serializers.ValidationError("Username must be between 6 and 20 characters.")

        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Username must contain at least one digit.")

        normalized_username = value.lower()

        if CustomUser.objects.filter(username__iexact=normalized_username).exists():
            raise serializers.ValidationError("This username is already taken.")

        return value

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)

    def validate(self, data):
        username = data["username"].strip().lower()

        user = CustomUser.objects.filter(username=username).first()
        if not user:
           raise serializers.ValidationError(f"Username '{username}' not found! Please register first.")

        data["user"] = user
        return data
from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'age', 'is_active']  # Add any other fields you want to include


class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'age', 'is_active', 'password']  # Add other fields if needed

    def create(self, validated_data):
        # Use the custom user manager to create a user
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            age=validated_data['age'],  # Save age here
            password=validated_data['password'],
        )
        return user
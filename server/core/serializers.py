from django.forms import ValidationError
from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    email = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=30, write_only=True)
    last_name = serializers.CharField(max_length=30, write_only=True)
    dob = serializers.DateField(write_only=True)
    is_admin = serializers.BooleanField()

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'dob', 'is_admin']
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


    
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    is_admin = serializers.BooleanField(read_only=True)

    def validate(self, data):
        email = data.get('email', None)
        password = data.get('password', None)

        user = authenticate(username=email, password=password)

        if user is None:
            raise ValidationError('Invalid email or password. Please try again.')
        
        return {
            'email': user.email,
            'is_admin': user.is_admin,
        }
    
    
class RefreshTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(max_length=255)

    def validate_refresh_token(self, value):
        if not value:
            raise serializers.ValidationError("No refresh token provided")
        return value

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'dob']
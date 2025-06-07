from django.shortcuts import render
from django.conf import settings
import jwt
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Session
from .serializers import LoginSerializer, RefreshTokenSerializer, UserInfoSerializer, UserSerializer
from core.JWTAuthentication import JWTAuthentication

class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if(serializer.validated_data['is_admin']):
                Response({"message": "You don`t have permissions!"}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save()
            session = Session.objects.create(user=user)
            access_token, refresh_token = user.generate_tokens(session.id)
            return Response({                
                'is_admin': user.is_admin,
                "access_token": access_token,
                "refresh_token": refresh_token
                }, status=status.HTTP_201_CREATED)
        else:
            error_messages = list(serializer.errors.values())[0][0]
            print(serializer.errors)
            return Response({"message": error_messages}, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = User.objects.get(email=serializer.validated_data['email'])
            session = Session.objects.create(user=user)
            access_token, refresh_token = user.generate_tokens(session.id) 

            return Response({
                'is_admin': user.is_admin,
                "access_token": access_token,
                "refresh_token": refresh_token
            }, status=status.HTTP_200_OK)

        else:
            error_messages = list(serializer.errors.values())[0][0]
            return Response({"message": error_messages}, status=status.HTTP_400_BAD_REQUEST)
    
class RefreshTokenAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RefreshTokenSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh_token = serializer.validated_data.get('refresh_token')

        try:
            decoded = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded['id']
            session_id = decoded['session_id']
            user = User.objects.get(pk=user_id)
            session = Session.objects.get(pk=session_id)
        except jwt.ExpiredSignatureError:
            return Response({'message': 'Refresh token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'message': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Session.DoesNotExist:
            return Response({'message': 'A session corresponding to this token was not found'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'message': 'User account is not active'}, status=status.HTTP_401_UNAUTHORIZED)

        access_token, refresh_token = user.generate_tokens(session.id) 
        response_data = {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'is_admin': user.is_admin,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class LogOutAPIView(APIView):
    serializer_class = RefreshTokenSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data.get('refresh_token')

        try:
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            session_id = decoded['session_id']

            session = Session.objects.get(pk=session_id)
            session.delete()

            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"message": "Token has expired."}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"message": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        except Session.DoesNotExist:
            return Response({"message": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
class UserInfoAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data)
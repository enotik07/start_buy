import jwt

from django.conf import settings

from rest_framework import authentication, exceptions
from rest_framework.permissions import BasePermission

from .models import Session, User


class JWTAuthentication(authentication.BaseAuthentication):
    authentication_header_prefix = 'Bearer'

    def authenticate(self, request):
        request.user = None
        auth_header = authentication.get_authorization_header(request).split()
        auth_header_prefix = self.authentication_header_prefix.lower()

        if not auth_header:
            return None

        elif len(auth_header) == 1 or len(auth_header) > 2:
            return None
        
        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')

        if prefix.lower() != auth_header_prefix:
            return None
        return self._authenticate_credentials(request, token)

    def _authenticate_credentials(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except Exception:
            msg = 'Authentication error. Unable to decode token'
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = User.objects.get(pk=payload['id'])
        except User.DoesNotExist:
            msg = 'A user corresponding to this token was not found'
            raise exceptions.AuthenticationFailed(msg)

        try:
            session = Session.objects.get(pk=payload['session_id'])
        except Session.DoesNotExist:
            msg = 'A session corresponding to this token was not found'
            raise exceptions.AuthenticationFailed(msg)

        if not user.is_active:
            msg = 'This user has been deactivated'
            raise exceptions.AuthenticationFailed(msg)

        return (user, token)
    
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'is_admin', False))
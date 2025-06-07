from django.db import models
import jwt
from django.contrib.auth.models import (
	AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from datetime import datetime, timedelta
from django.conf import settings

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, dob, password=None, is_admin=False):
        user = self.model(
            email=self.normalize_email(email),
            is_admin=is_admin,
            first_name=first_name,
            last_name=last_name,   
            dob=dob,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name='admin', last_name='admin', dob=None):
        user = self.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            dob=dob,
            is_admin=False,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    dob = models.DateField(null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'dob']

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def generate_tokens(self, session_id):
        return self._generate_jwt_token(session_id), self._generate_jwt_token(session_id, token_type='refresh')
    
    def _generate_jwt_token(self, session_id, token_type='access'):
        dt = datetime.now() + timedelta(minutes=15) if token_type == 'access' else datetime.now() + timedelta(days=1)
        payload = {
            'id': self.pk,
            'session_id': session_id,
            'exp': int(dt.timestamp())
        }
        if token_type == 'refresh':
            payload['type'] = 'refresh'
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token

class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sessions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
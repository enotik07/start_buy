from django.urls import path
from .views import LoginAPIView, RefreshTokenAPIView, RegistrationAPIView, LogOutAPIView, UserInfoAPIView
app_name = 'core'
urlpatterns = [
    path('register/', RegistrationAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('refresh/', RefreshTokenAPIView.as_view()),
    path('log-out/', LogOutAPIView.as_view()),
    path('user-info/', UserInfoAPIView.as_view()),

]
from django.urls import path
from .views import (
    RecommendationsAPIView,
    SimilarProductsAPIView,
)
app_name = 'recommendation'
urlpatterns = [
    path('similar/<int:product_id>/', SimilarProductsAPIView.as_view()),
    path('recommendation/', RecommendationsAPIView.as_view()),
]
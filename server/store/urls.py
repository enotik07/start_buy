from django.urls import path
from .views import CartItemAPIView, CategoriesNamesView, CategoriesView, CategoryDetailAPIView, ImageFromURLView, PopularCategoriesAPIView, ProductDetailAPIView, ProductsView, StatisticsView
app_name = 'store'
urlpatterns = [
    path('categories', CategoriesView.as_view()),
    path('category/<int:id>/', CategoryDetailAPIView.as_view()),
    path('categories/names', CategoriesNamesView.as_view()),
    path('popular-categories', PopularCategoriesAPIView.as_view()),

    path('image-decode', ImageFromURLView.as_view()),
    
    path('products', ProductsView.as_view()),
    path('product/<int:id>/', ProductDetailAPIView.as_view()),

    path('statistics', StatisticsView.as_view()),

    path('cart', CartItemAPIView.as_view()),

]
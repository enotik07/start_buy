import os
from django.shortcuts import get_object_or_404
from core.JWTAuthentication import IsAdmin, JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from smartbuy import settings
from store.statistics import get_category_stats, get_order_stats, get_order_sum_stats, get_product_stats
from .models import CartItem, Category, Product, ProductNavigation
from .serializers import CartItemSerializer, CategoryNameSerializer, CategorySerializer, PopularCategorySerializer, ProductSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import JSONParser
from django.db.models import Q, Count
import base64
import requests
import mimetypes

class Pagination(PageNumberPagination):
    page_size = 10  
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'pages': self.page.paginator.num_pages,
            'results': data
        })
    
class CategoriesNamesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] 
    serializer_class = CategoryNameSerializer

    def get(self, request):        
        categories = Category.objects.all().order_by('name')
        serializer = self.serializer_class(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CategoriesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] 
    serializer_class = CategorySerializer
    pagination_class = Pagination
    
    def get(self, request):        
        query = request.query_params.get('query', '').strip()
        categories = Category.objects.prefetch_related('products').all()
        categories = categories.order_by('-created_at')
        if query and query!='':
            categories = categories.filter(
                Q(name__icontains=query) | Q(description__icontains=query)
            )

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(categories, request)

        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):     
        self.permission_classes = [IsAuthenticated, IsAdmin]
        self.check_permissions(request)   

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():            
            serializer.save()
            return Response({"message": "Category successfully created"}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request):
        self.permission_classes = [IsAuthenticated, IsAdmin]  
        self.check_permissions(request)
        id = request.query_params.get('id', None)

        category = get_object_or_404(Category, pk=id)
        serializer = self.serializer_class(category, data=request.data, partial=True)
        if(('image' in request.data or 'image_url' in request.data) and category.image):
            category.image.delete(save=False)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Category successfully updated"}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        self.permission_classes = [IsAuthenticated, IsAdmin]
        self.check_permissions(request)
        id = request.query_params.get('id', None)
        category = get_object_or_404(Category, pk=id)
        category.image.delete(save=False)
        if category.image:
            image_path = os.path.join(settings.MEDIA_ROOT, str(category.image))
            if os.path.exists(image_path):
                os.remove(image_path)
        category.delete()
        return Response({"message": "Category successfully deleted"}, status=status.HTTP_204_NO_CONTENT)
    
class CategoryDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] 
    serializer_class = CategorySerializer
    def get(self, request, id):
        try:
            category = Category.objects.get(pk=id)
        except Category.DoesNotExist:
            return Response({'message': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ImageFromURLView(APIView):
    parser_classes = [JSONParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin] 
    def post(self, request):
        image_url = request.data.get('url')

        if not image_url:
            return Response({"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': 'https://google.com', 
            }
            response = requests.get(image_url, headers=headers)
            response.raise_for_status()  

            image_data = response.content

            mime_type = response.headers.get('Content-Type')
            if not mime_type:
                mime_type = mimetypes.guess_type(image_url)[0] or 'application/octet-stream'

            encoded_image = base64.b64encode(image_data).decode('utf-8')
            return Response({
                "mime_type": mime_type,
                "data": encoded_image
            }, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response({"error": f"Failed to download image: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        

class ProductsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] 
    serializer_class = ProductSerializer
    pagination_class = Pagination

    def get(self, request):        
        query = request.query_params.get('query', '').strip()
        products = Product.objects.prefetch_related('images', 'categories').all()

        if query:
            products = products.filter(
                Q(name__icontains=query) | Q(description__icontains=query)
            )
        products = products.order_by('-created_at')
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(products, request)

        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):     
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)   

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():            
            serializer.save()
            return Response({"message": "Product successfully created"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        self.permission_classes = [IsAuthenticated]  
        self.check_permissions(request)
        id = request.query_params.get('id', None)
        product = get_object_or_404(Product, pk=id)
        serializer = self.serializer_class(product, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Product successfully updated"}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        id = request.query_params.get('id', None)
        product = get_object_or_404(Product, pk=id)
        for image_obj in product.images.all():
            image_obj.image.delete(save=False)
        product.delete()
        return Response({"message": "Product successfully deleted"}, status=status.HTTP_204_NO_CONTENT)
    
class ProductDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] 
    serializer_class = ProductSerializer
    def get(self, request, id):
        source = request.query_params.get('source')
        query = request.query_params.get('query')
        try:
            product = Product.objects.get(pk=id)
        except Product.DoesNotExist:
            return Response({'message': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        source_product = None
        if source:
            try:
                source_product = Product.objects.get(pk=source)
            except Product.DoesNotExist:
                pass 
        
        ProductNavigation.objects.create(
            user=request.user if request.user.is_authenticated else None,
            source_product=source_product,
            search_query=query,
            destination_product=product
        )

        serializer = self.serializer_class(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StatisticsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):   
        statistics = [
            get_product_stats(),
            get_category_stats(),
            get_order_stats(),
            get_order_sum_stats()
        ]
        return Response(statistics, status=status.HTTP_200_OK)
    
class PopularCategoriesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] 
    serializer_class = PopularCategorySerializer
    pagination_class = Pagination

    def get(self, request):
        categories = Category.objects.annotate(
            total_navigations=Count('products__destination_navigations', distinct=False)
        ).order_by('-total_navigations')

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(categories, request)
        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
class CartItemAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    # permission_classes = [AllowAny] 
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer
    pagination_class = Pagination

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        cart_items = cart_items.order_by('-created_at')
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(cart_items, request)
        serializer = self.serializer_class(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product')
        quantity = request.data.get('quantity', 1)
        product = get_object_or_404(Product, pk=product_id)
        existing_item = CartItem.objects.filter(
            user=request.user,
            product=product
        ).first()
        
        if existing_item:
            existing_item.quantity = int(quantity)
            existing_item.save()
        else:
            cart_item = CartItem(
                user=request.user,
                product=product,
                quantity=quantity
            )
            cart_item.save()
        
        return Response({"message": "Product successfully added to cart"}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        id = request.query_params.get('id', None)
        cart_item = get_object_or_404(CartItem, pk=id, user=request.user)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

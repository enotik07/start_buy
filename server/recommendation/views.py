from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.JWTAuthentication import JWTAuthentication
from recommendation.neural_network import RecommendationModel
from store.models import Product, ProductNavigation
from store.serializers import ProductCardSerializer
from store.views import Pagination
from rest_framework.permissions import AllowAny
from django.db.models import Count

recommendation_model = RecommendationModel()


class SimilarProductsAPIView(APIView):
    pagination_class = Pagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] 
    serializer_class = ProductCardSerializer
    
    def get(self, request, product_id):
        try:        
            similar_product_ids = recommendation_model.get_similar_products(
                product_id, 
            )
            similar_products = Product.objects.filter(id__in=similar_product_ids)
            paginator = self.pagination_class()
            paginated_products = paginator.paginate_queryset(similar_products, request)
            
            serializer = self.serializer_class(paginated_products, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class RecommendationsAPIView(APIView):
    pagination_class = Pagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]     
    serializer_class = ProductCardSerializer
    
    def get(self, request):
        try:
            filter_params = extract_filter_params(request)
            filter_func = create_filter_function(filter_params)
            
            if filter_params['query']:
                product_ids = recommendation_model.search_products(filter_params['query'])
                filtered_product_ids = []
                for pid in product_ids:
                    product_data = Product.objects.prefetch_related('categories').get(id=pid)
                    if product_data and filter_func(product_data):
                        filtered_product_ids.append(pid)
                product_ids = filtered_product_ids
            else:
                if request.user.is_authenticated:
                    user_view_count = ProductNavigation.objects.filter(user=request.user).count()
                    if user_view_count >= 5:
                        product_ids = recommendation_model.get_recommendations_for_user(
                            request.user.id,
                            filter_func=filter_func
                        )
                    else:
                        product_ids = recommendation_model.get_popular_products(
                            filter_func=filter_func
                        )
                else:
                    product_ids = recommendation_model.get_popular_products(
                        filter_func=filter_func
                    )
            
            sort_param = request.query_params.get('sort', None)
            sorted_products = get_sorted_products(product_ids, sort_param)
            paginator = self.pagination_class()
            paginated_products = paginator.paginate_queryset(sorted_products, request)
            serializer = self.serializer_class(paginated_products, many=True)
            return paginator.get_paginated_response(serializer.data)
            
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    
def get_sorted_products(product_ids, sort_param):
    if not product_ids:
        return []
            
    products = Product.objects.filter(id__in=product_ids).prefetch_related('categories')

    if sort_param == 'newest':
        return products.order_by('-created_at')
    elif sort_param == 'priceLowToHigh':
        return products.order_by('price')
    elif sort_param == 'priceHighToLow':
        return products.order_by('-price')
    elif sort_param == 'popularity':
        return products.annotate(
            navigation_count=Count('destination_navigations')
        ).order_by('-navigation_count')
    
    return products   

def extract_filter_params(request):
    return {        
        'price_min': request.query_params.get('price_min'),
        'price_max': request.query_params.get('price_max'),
        'query': request.query_params.get('query'),
        'categories': request.query_params.getlist('categories'),
    }
    
def create_filter_function(filter_params):
    def filter_func(product_data):
        if filter_params['price_min'] and float(filter_params['price_min']) > product_data.price:
            return False
        if filter_params['price_max'] and float(filter_params['price_max']) < product_data.price:
            return False
        if filter_params['categories']:
            try:
                category_ids = [int(c) for c in filter_params['categories']]
                product_category_ids = getattr(product_data, 'categories', [])

                if hasattr(product_category_ids, 'values_list'):
                    product_category_ids = list(product_category_ids.values_list('id', flat=True))

                if not any(cat_id in product_category_ids for cat_id in category_ids):
                    return False
            except (ValueError, TypeError):
                pass
        return True
            
    return filter_func

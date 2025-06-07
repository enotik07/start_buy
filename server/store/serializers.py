
from rest_framework import serializers
from .models import CartItem, Category, Product, ProductImage
from django.core.exceptions import ValidationError
from django.utils.timesince import timesince
from datetime import datetime, timezone

class PopularCategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    icon = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']

    def get_icon(self, obj):
        return obj.image.url if obj.image else obj.image_url
    
class CategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    icon = serializers.SerializerMethodField(read_only=True)
    products = serializers.IntegerField(source='products.count', read_only=True)
    image_url = serializers.CharField(write_only=True, required=False)
    image = serializers.FileField(write_only=True, required=False)
    time_since_created = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'products', 'image_url', 'image', 'time_since_created']

    def get_icon(self, obj):
        return obj.image.url if obj.image else obj.image_url
    
    def get_time_since_created(self, obj):
        time_since = timesince(obj.created_at, now=datetime.now(timezone.utc))
        first_part = time_since.split(',')[0]
        return first_part + ' ago'
    
    def validate_image(self, value):
        allowed_extensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"]
        file_name = value.name.lower()
        
        file_extension = file_name.split(".")[-1] if "." in file_name else ""

        if file_extension not in allowed_extensions:
            raise ValidationError(f"Unsupported file format. Allowed formats: {', '.join(allowed_extensions)}")

        return value
    
class ProductCardSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']
        
    def get_image(self, obj):
        return [image.image.url for image in obj.images.all()][0]
    

class ProductSerializer(serializers.ModelSerializer):
    images_data = serializers.ListField(
        child=serializers.FileField(max_length=None, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    existing_images = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    category_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    images = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    time_since_created = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price',
            'category_ids', 'categories',
            'images', 'existing_images', 'images_data', 'time_since_created'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images_data', [])
        category_ids = validated_data.pop('category_ids', [])

        product = Product.objects.create(**validated_data)
        product.categories.set(Category.objects.filter(id__in=category_ids))

        for image in images_data:
            ProductImage.objects.create(product=product, image=image)

        return product

    def update(self, instance, validated_data):
        print('validated_data', validated_data)
        images_data = validated_data.pop('images_data', [])
        existing_images = validated_data.pop('existing_images', [])
        category_ids = validated_data.pop('category_ids', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.categories.set(Category.objects.filter(id__in=category_ids))
        print('existing_images', existing_images)
        if existing_images is None or not existing_images:
            for image_obj in instance.images.all():
                image_obj.image.delete(save=False)
                image_obj.delete()
        else:
            for image_obj in instance.images.all():
                if image_obj.image.url not in existing_images:
                    image_obj.image.delete(save=False)
                    image_obj.delete()
        for image in images_data:
            ProductImage.objects.create(product=instance, image=image)

        return instance
    
    def get_images(self, obj):
        return [image.image.url for image in obj.images.all()]

    def get_categories(self, obj):
        return [category.id for category in obj.categories.all()]
    
    
    def get_time_since_created(self, obj):
        time_since = timesince(obj.created_at, now=datetime.now(timezone.utc))
        first_part = time_since.split(',')[0]
        return first_part + ' ago'
    
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductCardSerializer()
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']
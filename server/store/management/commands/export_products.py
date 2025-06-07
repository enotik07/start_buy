import json
import base64
import os
from django.core.management.base import BaseCommand
from django.core.serializers.json import DjangoJSONEncoder
from store.models import Product, ProductImage

class DecimalEncoder(DjangoJSONEncoder):
    def default(self, obj):
        from decimal import Decimal
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

class Command(BaseCommand):
    help = 'Export all products to a JSON file with images in base64 format'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            default='products.json',
            help='Output file path (default: products.json)'
        )

    def handle(self, *args, **options):
        output_file = options['output']
        
        products = Product.objects.all().prefetch_related('categories', 'images')
        
        products_data = []
        for product in products:
            product_dict = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': float(product.price),
                'categories': list(product.categories.values_list('id', flat=True)),  
                'images': []
            }
            
            for product_image in product.images.all():
                if product_image.image and os.path.exists(product_image.image.path):
                    try:
                        with open(product_image.image.path, 'rb') as img_file:
                            file_ext = os.path.splitext(product_image.image.name)[1][1:].lower()
                            mime_type = f"image/{file_ext}"
                            if file_ext == 'jpg' or file_ext == 'jpeg':
                                mime_type = 'image/jpeg'
                            
                            binary_data = img_file.read()
                            base64_data = base64.b64encode(binary_data).decode('utf-8')
                            
                            image_data = f"data:{mime_type};base64,{base64_data}"
                            product_dict['images'].append(image_data)
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(
                            f"Failed to encode image for product {product.name}: {e}"
                        ))
            
            products_data.append(product_dict)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products_data, f, ensure_ascii=False, indent=4, cls=DecimalEncoder)
        
        self.stdout.write(self.style.SUCCESS(
            f'Successfully exported {len(products_data)} products in file {output_file}'
        ))
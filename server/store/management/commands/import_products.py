import json
import base64
import os
import uuid
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from store.models import Product, ProductImage, Category 

class Command(BaseCommand):
    help = 'Import products from a JSON file with images saved on the server'

    def add_arguments(self, parser):
        parser.add_argument(
            '--input',
            default='products.json',
            help='Path to JSON file (default: products.json)'
        )

    def handle(self, *args, **options):
        input_file = options['input']
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                products_data = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error reading file: {e}'))
            return
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for prod_data in products_data:
            try:
                existing_product = Product.objects.filter(id=prod_data.get('id')).first()
                
                if existing_product:
                    product = existing_product
                    product.name = prod_data.get('name', product.name)
                    product.description = prod_data.get('description', product.description)
                    product.price = prod_data.get('price', product.price)
                    product.save()
                    updated_count += 1
                else:
                    product = Product.objects.create(
                        id=prod_data.get('id'),
                        name=prod_data.get('name'),
                        description=prod_data.get('description'),
                        price=prod_data.get('price')
                    )
                    created_count += 1
                
                category_ids = prod_data.get('categories', [])
                if category_ids:
                    if existing_product:
                        product.categories.clear()
                    
                    categories = Category.objects.filter(id__in=category_ids)
                    product.categories.add(*categories)
                
                images_data = prod_data.get('images', [])
                
                if existing_product:
                    for old_image in product.images.all():
                        if old_image.image:
                            old_image.image.delete(save=False)
                    product.images.all().delete()
                
                for image_data in images_data:
                    if image_data and image_data.startswith('data:'):
                        format_data, image_str = image_data.split(';base64,')
                        ext = format_data.split('/')[1]
                        if ext == 'jpeg':
                            ext = 'jpg'
                        
                        binary_data = base64.b64decode(image_str)
                        
                        filename = f"product_{product.id}_{uuid.uuid4().hex}.{ext}"
                        
                        product_image = ProductImage(product=product)
                        
                        product_image.image.save(
                            filename,
                            ContentFile(binary_data),
                            save=True
                        )
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f"Error importing product '{prod_data.get('name', 'Unknown')}': {e}"
                ))
                skipped_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'Import complete: created {created_count}, updated {updated_count}, missed {skipped_count} products'
        ))
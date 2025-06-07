import json
import base64
import os
from django.core.management.base import BaseCommand
from django.core.serializers.json import DjangoJSONEncoder
from store.models import Category

class Command(BaseCommand):
    help = 'Export all categories to a JSON file with images in base64 format'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            default='categories.json',
            help='Output file path (default: categories.json)'
        )

    def handle(self, *args, **options):
        output_file = options['output']
        
        categories = Category.objects.all()
        
        categories_data = []
        for category in categories:
            category_dict = {
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'image_url': category.image_url,
            }
            
            if category.image and os.path.exists(category.image.path):
                try:
                    with open(category.image.path, 'rb') as img_file:
                        file_ext = os.path.splitext(category.image.name)[1][1:].lower()
                        mime_type = f"image/{file_ext}"
                        if file_ext == 'jpg' or file_ext == 'jpeg':
                            mime_type = 'image/jpeg'
                        
                        binary_data = img_file.read()
                        base64_data = base64.b64encode(binary_data).decode('utf-8')
                        
                        category_dict['image_data'] = f"data:{mime_type};base64,{base64_data}"
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Failed to encode image for category {category.name}: {e}"))
                    category_dict['image_data'] = None
            else:
                category_dict['image_data'] = None
                
            categories_data.append(category_dict)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(categories_data, f, ensure_ascii=False, indent=4)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully exported {len(categories_data)} categories in a file {output_file}'))
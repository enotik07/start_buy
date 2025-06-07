import json
import base64
import os
import uuid
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from store.models import Category 

class Command(BaseCommand):
    help = 'Import categories from a JSON file with images saved on the server'

    def add_arguments(self, parser):
        parser.add_argument(
            '--input',
            default='categories.json',
            help='Path to JSON file (default: categories.json)'
        )

    def handle(self, *args, **options):
        input_file = options['input']
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                categories_data = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error reading file: {e}'))
            return
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for cat_data in categories_data:
            try:
                category, created = Category.objects.get_or_create(
                    id=cat_data.get('id'),
                    defaults={
                        'name': cat_data.get('name'),
                        'description': cat_data.get('description'),
                        'image_url': cat_data.get('image_url')
                    }
                )
                if category.image:
                    category.image.delete(save=False)
                
                if not created:
                    category.name = cat_data.get('name', category.name)
                    category.description = cat_data.get('description', category.description)
                    category.image_url = cat_data.get('image_url', category.image_url)
                    updated_count += 1
                else:
                    created_count += 1
                
                image_data = cat_data.get('image_data')
                if image_data and image_data.startswith('data:'):
                    format_data, image_str = image_data.split(';base64,')
                    ext = format_data.split('/')[1]
                    if ext == 'jpeg':
                        ext = 'jpg'
                    
                    image_data = base64.b64decode(image_str)
                    
                    filename = f"category_{category.id}_{uuid.uuid4().hex}.{ext}"
                    
                    category.image.save(
                        filename,
                        ContentFile(image_data),
                        save=True
                    )
                
                category.save()
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error importing category '{cat_data.get('name', 'Unknown')}': {e}"))
                skipped_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'Import complete: created {created_count}, updated {updated_count}, missed {skipped_count} categories'
        ))
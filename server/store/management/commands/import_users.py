from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
import random
from datetime import timedelta
from store.models import Product, ProductNavigation

User = get_user_model()

class Command(BaseCommand):
    help = 'Import users from JSON file and generate product navigation activities'

    def add_arguments(self, parser):
        parser.add_argument(
            '--input',
            default='users.json',
            help='Path to JSON file (default: users.json)'
        )

    def handle(self, *args, **options):
        json_file = options['input']
        try:
            with open(json_file, 'r') as file:
                users_data = json.load(file)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to load JSON file: {e}'))
            return

        products = list(Product.objects.all())
        if not products:
            self.stdout.write(self.style.ERROR('No products found in database. Please add products first.'))
            return

        search_queries = [
            'smartphone', 'headphones', 'laptop', 'television', 'speaker', 'monitor'
        ]

        created_users = 0
        generated_activities = 0

        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'dob': user_data['dob'],
                }
            )

            if created:
                user.set_password(user_data['password'])
                user.save()
                created_users += 1
                self.stdout.write(self.style.SUCCESS(f'Created user: {user.email}'))
            else:
                self.stdout.write(f'User {user.email} already exists, skipping...')

            base_time = timezone.now() - timedelta(days=30)
            
            for i in range(10):
                activity_type = random.choice(['search', 'product_navigation', 'external'])
                
                created_at = base_time + timedelta(days=random.randint(0, 29), 
                                                hours=random.randint(0, 23),
                                                minutes=random.randint(0, 59))
                
                destination_product = random.choice(products)
                
                navigation = ProductNavigation(
                    user=user,
                    destination_product=destination_product,
                    created_at=created_at
                )
                
                if activity_type == 'search':
                    navigation.search_query = random.choice(search_queries)
                    navigation.source_product = None
                elif activity_type == 'product_navigation':
                    available_sources = [p for p in products if p != destination_product]
                    if available_sources:
                        navigation.source_product = random.choice(available_sources)
                    navigation.search_query = None
                else: 
                    navigation.source_product = None
                    navigation.search_query = None
                
                navigation.save()
                generated_activities += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {created_users} users and generated {generated_activities} navigation activities'
        ))
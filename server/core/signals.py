from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth import get_user_model
from django.conf import settings

@receiver(post_migrate)
def create_admins(sender, **kwargs):
    User = get_user_model()
    
    if not User.objects.filter(is_superuser=True).exists():
        print("🔐 Creating a default superuser...")
        User.objects.create_superuser(
            email=settings.SUPERUSER_EMAIL,
            password=settings.SUPERUSER_PASSWORD,
            first_name='Super',
            last_name='User',
            dob='1990-01-01'
        )

    if not User.objects.filter(is_admin=True).exists():
        print("🛠️ Creating a default administrator...")
        User.objects.create_user(
            email=settings.ADMIN_EMAIL,
            password=settings.ADMIN_PASSWORD,
            first_name='Admin',
            last_name='User',
            dob='1990-01-01',
            is_admin=True
        )
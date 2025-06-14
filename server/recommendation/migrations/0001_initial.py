# Generated by Django 5.1.7 on 2025-04-11 19:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('store', '0006_productnavigation_search_query_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='RecommendationModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('version', models.CharField(max_length=50)),
                ('last_trained', models.DateTimeField(auto_now=True)),
                ('embedding_size', models.IntegerField(default=32)),
                ('loss_value', models.FloatField(blank=True, null=True)),
                ('model_path', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='ProductEmbedding',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('embedding_vector', models.TextField()),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('product', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='embedding', to='store.product')),
            ],
        ),
        migrations.CreateModel(
            name='UserEmbedding',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('embedding_vector', models.TextField()),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='embedding', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

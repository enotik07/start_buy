from django.apps import AppConfig


class RecommendationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'recommendation'

    # def ready(self):
    #     """Initialize recommendation engine when app starts"""
    #     from django.conf import settings
    #     # if not settings.DEBUG or getattr(settings, 'INITIALIZE_RECOMMENDATION', False):
    #     #     # Only in production or when explicitly configured
    #     from .neural_network import RecommendationEngine
    #     engine = RecommendationEngine()

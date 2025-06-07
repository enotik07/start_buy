from django.db import models

from core.models import User

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='categories/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    categories = models.ManyToManyField(Category, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    
    def __str__(self):
        return f'Image for {self.product.name}'

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Order {self.id} - {self.user.username}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f'{self.quantity} x {self.product.name} in Order {self.order.id}'

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.quantity} x {self.product.name} in Cart of {self.user.first_name}'

class ProductNavigation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_navigations', null=True, blank=True)
    source_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='source_navigations', null=True, blank=True)
    search_query = models.CharField(max_length=500, null=True, blank=True)
    destination_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='destination_navigations')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['source_product']),
            models.Index(fields=['destination_product']),
            models.Index(fields=['search_query']),
        ]
    
    def __str__(self):
        user_str = self.user.email if self.user else "anonymous user"
        if self.search_query:
            return f"{user_str} found {self.destination_product.name} via search: '{self.search_query}'"
        elif self.source_product:
            return f"{user_str} navigated from {self.source_product.name} to {self.destination_product.name}"
        else:
            return f"{user_str} navigated to {self.destination_product.name} from external source"

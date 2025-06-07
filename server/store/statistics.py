from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from store.models import Category, Order, Product

def get_last_changes(last_changes, count, title, unit=""):
    if last_changes['day'] > 0:
        change_value = f"{last_changes['day']:.2f}" if unit != "" else f"{last_changes['day']}"
        change_str = f"+{change_value}{unit} from yesterday"
    elif last_changes['week'] > 0:
        change_value = f"{last_changes['week']:.2f}" if unit != "" else f"{last_changes['week']}"
        change_str = f"+{change_value}{unit} from last week"
    elif last_changes['month'] > 0:
        change_value = f"{last_changes['month']:.2f}" if unit != "" else f"{last_changes['month']}"
        change_str = f"+{change_value}{unit} from last month"
    elif last_changes['year'] > 0:
        change_value = f"{last_changes['year']:.2f}" if unit != "" else f"{last_changes['year']}"
        change_str = f"+{change_value}{unit} from last year"
    else:
        change_str = "No change last year"
   
    return {
        'title': title,
        'count': count if unit=="" else f"${count:.2f}",
        'change': change_str
    }

def get_periods():
    today = timezone.now()
    yesterday = today - timedelta(days=1)
    last_week = today - timedelta(days=7)
    last_month = today - timedelta(days=30)
    last_year = today - timedelta(days=365)
    return {
        'yesterday': yesterday,
        'last_week': last_week,
        'last_month': last_month,
        'last_year': last_year
    }

def get_count_stats(objects, title):
    periods = get_periods()
    count = objects.count()
    yesterday_count = objects.filter(created_at__lt=periods['yesterday']).count()
    last_week_count = objects.filter(created_at__lt=periods['last_week']).count()
    last_month_count = objects.filter(created_at__lt=periods['last_month']).count()
    last_year_count = objects.filter(created_at__lt=periods['last_year']).count()
   
    day_diff = count - yesterday_count
    week_diff = count - last_week_count
    month_diff = count - last_month_count
    year_diff = count - last_year_count
    return get_last_changes(
        {
            'day': day_diff,
            'week': week_diff,
            'month': month_diff,
            'year': year_diff
        },
        count,
        title
    )

def get_product_stats():
    return get_count_stats(Product.objects, 'Total Products')

def get_category_stats():
    return get_count_stats(Category.objects, 'Categories')

def get_order_stats():
    return get_count_stats(Order.objects, 'Orders')
   
def get_order_sum_stats():
    periods = get_periods()
    current_sum = Order.objects.filter(status='completed').aggregate(
        total_sum=Sum('total')
    )['total_sum'] or 0
    
    yesterday_sum = Order.objects.filter(
        status='completed', created_at__lt=periods['yesterday']
    ).aggregate(total_sum=Sum('total'))['total_sum'] or 0
    
    last_week_sum = Order.objects.filter(
        status='completed', created_at__lt=periods['last_week']
    ).aggregate(total_sum=Sum('total'))['total_sum'] or 0
    
    last_month_sum = Order.objects.filter(
        status='completed', created_at__lt=periods['last_month']
    ).aggregate(total_sum=Sum('total'))['total_sum'] or 0
    
    last_year_sum = Order.objects.filter(
        status='completed', created_at__lt=periods['last_year']
    ).aggregate(total_sum=Sum('total'))['total_sum'] or 0
    
    day_pct = ((float(current_sum) - float(yesterday_sum)) / float(yesterday_sum) * 100) if yesterday_sum > 0 else 0
    week_pct = ((float(current_sum) - float(last_week_sum)) / float(last_week_sum) * 100) if last_week_sum > 0 else 0
    month_pct = ((float(current_sum) - float(last_month_sum)) / float(last_month_sum) * 100) if last_month_sum > 0 else 0
    year_pct = ((float(current_sum) - float(last_year_sum)) / float(last_year_sum) * 100) if last_year_sum > 0 else 0

    return get_last_changes(
        {
            'day': day_pct,
            'week': week_pct,
            'month': month_pct,
            'year': year_pct
        },
        current_sum,
        'Revenue',
        "%"
    )
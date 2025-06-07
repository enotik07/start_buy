# SmartBuy

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)

## Overview
SmartBuy is a Django REST Framework (DRF) project designed to provide a robust backend for an e-commerce platform.

## Features

- User JWT authentication and authorization
- Product management (CRUD operations)
- Category management (CRUD operations)
- Recommendation system based on neural network 
- Shopping cart functionality

## Environment Variables

To configure the project, set the following environment variables:

| Variable Name         | Description                        | Example Value                                                    |
|-----------------------|------------------------------------|------------------------------------------------------------------|
| `SUPERUSER_EMAIL`     | Email for the Django superuser     | `superUser@example.com`                                          |
| `SUPERUSER_PASSWORD`  | Password for the Django superuser  | `superUser`                                                      |
| `ADMIN_EMAIL`         | Email for the admin user           | `admin@example.com`                                              |
| `ADMIN_PASSWORD`      | Password for the admin user        | `Admin@123`                                                      |
| `SECRET_KEY`          | Django secret key                  | `django-insecure-!*t266m$98m3wnt!m9q9val1poh&06&6ebnwiyz1!zhl4z` |

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/CoderPavlo/smart-buy-server.git
    cd smart-buy-server
    ```

2. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Apply migrations:
    ```bash
    python manage.py migrate
    ```

5. Run the development server:
    ```bash
    python manage.py runserver
    ```

## API Endpoints

### Authentication (`core` app)
| Endpoint               | Method | Description                  |
|------------------------|--------|------------------------------|
| `/auth/register/`      | POST   | Register a new user          |
| `/auth/login/`         | POST   | Log in a user                |
| `/auth/refresh/`       | POST   | Refresh JWT token            |
| `/auth/log-out/`       | POST   | Log out a user               |
| `/auth/user-info/`     | GET    | Retrieve user information    |

### Recommendations (`recommendation` app)
| Endpoint                          | Method | Description                          |
|-----------------------------------|--------|--------------------------------------|
| `/similar/<product_id>/`          | GET    | Get similar products by product ID   |
| `/recommendation/`                | GET    | Get personalized recommendations     |

### Store (`store` app)
| Endpoint                          | Method | Description                          |
|-----------------------------------|--------|--------------------------------------|
| `/categories`                     | GET    | List all categories                  |
| `/categories`                     | POST   | Create a new category                |
| `/categories`                     | PUT    | Update an existing category          |
| `/categories`                     | DELETE | Delete a category                    |
| `/category/<id>/`                 | GET    | Retrieve a single category by ID     |
| `/categories/names`               | GET    | List category names                  |
| `/popular-categories`             | GET    | List popular categories              |
| `/image-decode`                   | POST   | Decode an image from a URL           |
| `/products`                       | GET    | List all products                    |
| `/products`                       | POST   | Create a new product                 |
| `/products`                       | PUT    | Update an existing product           |
| `/products`                       | DELETE | Delete a product                     |
| `/product/<id>/`                  | GET    | Retrieve a single product by ID      |
| `/statistics`                     | GET    | Retrieve store statistics            |
| `/cart`                           | POST   | Add an item to the shopping cart     |
| `/cart`                           | GET    | Retrieve cart items                  |
| `/cart`                           | DELETE | Remove an item from the cart         |
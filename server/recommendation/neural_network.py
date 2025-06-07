from django.db.models import Count
from store.models import Product, ProductNavigation
import numpy as np
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Embedding, Flatten, Dense, Concatenate
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import timedelta
from django.utils import timezone

class RecommendationModel:
    """
    A class for managing the recommendation model using collaborative filtering
    with embeddings and neural networks
    """
    def __init__(self):
        self.model = None
        self.user_mapping = {}  # Maps user IDs to indices
        self.product_mapping = {}  # Maps product IDs to indices
        self.reverse_product_mapping = {}  # Maps indices to product IDs
        self.product_embeddings = None
        self.text_embeddings = None
        self.last_trained = None
        
    def _create_model(self, num_users, num_products, embedding_size=50):
        """
        Create a neural network model for collaborative filtering
        """
        # User embedding
        user_input = Input(shape=(1,), name='user_input')
        user_embedding = Embedding(num_users, embedding_size, name='user_embedding')(user_input)
        user_vec = Flatten(name='flatten_users')(user_embedding)
        
        # Product embedding
        product_input = Input(shape=(1,), name='product_input')
        product_embedding = Embedding(num_products, embedding_size, name='product_embedding')(product_input)
        product_vec = Flatten(name='flatten_products')(product_embedding)
        
        # Concatenate embeddings
        concat = Concatenate()([user_vec, product_vec])
        
        # Hidden layers
        dense1 = Dense(128, activation='relu')(concat)
        dense2 = Dense(64, activation='relu')(dense1)
        
        # Output layer
        output = Dense(1, activation='sigmoid')(dense2)
        
        # Create and compile model
        model = Model(inputs=[user_input, product_input], outputs=output)
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        
        return model
    
    def train(self, force=False):
        """
        Train the recommendation model if it hasn't been trained recently
        """
        # Check if we need to retrain
        if not force and self.last_trained and timezone.now() - self.last_trained < timedelta(hours=24):
            return
            
        # Get all product navigation data
        navigations = ProductNavigation.objects.select_related('user', 'destination_product').all()
        
        if not navigations.exists():
            return
            
        # Prepare data
        data = []
        users = set()
        products = set()
        
        for nav in navigations:
            # Skip if user is anonymous
            if not nav.user:
                continue
                
            user_id = nav.user.id
            product_id = nav.destination_product.id
            
            users.add(user_id)
            products.add(product_id)
            
            # Each navigation is a positive interaction
            data.append((user_id, product_id, 1))
        
        # Create mapping dictionaries
        self.user_mapping = {user_id: idx for idx, user_id in enumerate(users)}
        self.product_mapping = {product_id: idx for idx, product_id in enumerate(products)}
        self.reverse_product_mapping = {idx: product_id for product_id, idx in self.product_mapping.items()}
        
        # Convert to numpy arrays
        user_indices = np.array([self.user_mapping[d[0]] for d in data])
        product_indices = np.array([self.product_mapping[d[1]] for d in data])
        labels = np.array([d[2] for d in data])
        
        # Create and train model
        self.model = self._create_model(len(users), len(products))
        self.model.fit(
            [user_indices, product_indices],
            labels,
            epochs=10,
            batch_size=64,
            verbose=0
        )
        
        # Extract product embeddings for similarity calculations
        product_embedding_layer = self.model.get_layer('product_embedding')
        self.product_embeddings = product_embedding_layer.get_weights()[0]
        
        
        # Generate text embeddings for search
        self._generate_text_embeddings()
        
        self.last_trained = timezone.now()
    
    def _generate_text_embeddings(self):
        """Generate text embeddings for products using TF-IDF"""
        products = Product.objects.all()
        
        # Combine name and description for better semantic search
        texts = [f"{p.name} {p.description or ''}" for p in products]
        
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer(min_df=2, max_df=0.95, stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        self.text_vectorizer = vectorizer
        self.text_embeddings = tfidf_matrix
        self.product_ids_for_search = [p.id for p in products]
    
    def get_recommendations_for_user(self, user_id, filter_func=None):
        """
        Get personalized recommendations for a user
        
        Args:
            user_id: The ID of the user
            filter_func: Function to filter candidate products
        
        Returns:
            List of recommended product IDs
        """
        self.train()
        
        if not self.model or user_id not in self.user_mapping:
            return self.get_popular_products(filter_func)
        
        user_idx = self.user_mapping[user_id]
        user_input = np.array([user_idx] * len(self.product_mapping))
        product_input = np.array(list(range(len(self.product_mapping))))
        
        predictions = self.model.predict([user_input, product_input], verbose=0).flatten()
        
        # Map predictions back to product IDs
        product_scores = [(self.reverse_product_mapping[idx], score) 
                          for idx, score in enumerate(predictions)]
        
        if filter_func:
            product_ids = [pid for pid, _ in product_scores]
            products = Product.objects.prefetch_related('categories').filter(id__in=product_ids)
            product_map = {product.id: product for product in products}

            product_scores = [
                (pid, score) for pid, score in product_scores
                if pid in product_map and filter_func(product_map[pid])
            ]

        # Sort by score (highest first)
        product_scores.sort(key=lambda x: x[1], reverse=True)
        
        return [pid for pid, _ in product_scores]
    
    def get_popular_products(self, filter_func=None):
        """
        Get most popular products based on navigation data
        
        Args:
            filter_func: Function to filter candidate products
        
        Returns:
            List of popular product IDs
        """

        products = Product.objects.annotate(
            navigation_count=Count('destination_navigations')
        ).order_by('-navigation_count')

        if filter_func:
            products = [p.id for p in products if filter_func(p)]

        return products
    
    def get_similar_products(self, product_id):
        """
        Get similar products based on embedding similarity
        
        Args:
            product_id: The ID of the product to find similar items for
            filter_func: Function to filter candidate products
        
        Returns:
            List of similar product IDs
        """
        self.train()  # Ensure model is trained
        
        if self.product_embeddings is None or product_id not in self.product_mapping:
            return self.get_popular_products()
        
        # Get product embedding
        product_idx = self.product_mapping[product_id]
        product_embedding = self.product_embeddings[product_idx]
        
        # Calculate similarity with all products
        similarities = np.dot(self.product_embeddings, product_embedding) / (
            np.linalg.norm(self.product_embeddings, axis=1) * np.linalg.norm(product_embedding)
        )
        
        # Map similarities to product IDs
        product_similarities = [(self.reverse_product_mapping[idx], sim) 
                                for idx, sim in enumerate(similarities)]
        
        # Sort by similarity (highest first)
        product_similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Skip the first product (which is the input product itself)
        return [pid for pid, _ in product_similarities[1:]]
    
    def search_products(self, query):
        """
        Search for products using text embeddings
        
        Args:
            query: The search query
        
        Returns:
            List of product IDs matching the query
        """
        self.train()  # Ensure model is trained
        
        if self.text_embeddings is None or not query:
            return []
        
        # Transform query to TF-IDF vector
        query_vec = self.text_vectorizer.transform([query])
        
        # Calculate cosine similarity
        similarities = cosine_similarity(query_vec, self.text_embeddings).flatten()
        
        # Get sorted indices
        sorted_indices = similarities.argsort()[::-1]
        
        # Map to product IDs
        results = [self.product_ids_for_search[idx] for idx in sorted_indices 
                  if similarities[idx] > 0.1]  # Apply similarity threshold
        
        return results

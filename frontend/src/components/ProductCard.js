import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const [adding, setAdding] = useState(false);

  // Get optimized image URL
  const optimizedImageUrl = getOptimizedImageUrl(product.image, 200, 150, 75);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} className="fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        <img
          src={optimizedImageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
          onError={(e) => {
            const target = e.target;
            target.src = 'https://via.placeholder.com/200x150?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({product.rating})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.inStock ? (
              <span className="text-green-600 text-sm">In Stock</span>
            ) : (
              <span className="text-red-600 text-sm">Out of Stock</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || adding || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">
              {adding ? 'Adding...' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
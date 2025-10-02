import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../hooks/useStore';
import { useFlyToCart } from '../hooks/useFlyToCart';

interface ProductCardProps {
  product: Product;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all duration-300 ${filled ? 'text-brand-gold fill-current' : 'text-white'}`} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const { fly } = useFlyToCart();
  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  const defaultVariant = product.variants[0];

  const handleAddToCart = () => {
    if (defaultVariant) {
      addToCart(product, defaultVariant);
      if (addToCartBtnRef.current) {
        fly(addToCartBtnRef.current);
      }
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  if (!defaultVariant) {
    return null; // or a placeholder for products with no variants
  }

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isInStock = totalStock > 0;

  const renderActionButon = () => {
    if (product.isPreOrder) {
      return (
        <Link 
          to={`/product/${product.id}`}
          className="mt-4 block text-center w-full bg-brand-deep border border-brand-deep text-white py-2 uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80"
        >
          Pre-Order
        </Link>
      );
    }
    if (isInStock) {
      return (
        <button 
          ref={addToCartBtnRef}
          onClick={handleAddToCart} 
          className="mt-4 w-full bg-transparent border border-brand-gold text-brand-gold py-2 uppercase tracking-widest transition-all duration-300 hover:bg-brand-gold hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAdded}
        >
          {isAdded ? 'Added!' : 'Add to Cart'}
        </button>
      )
    }
    return (
       <button 
          className="mt-4 w-full bg-transparent border border-gray-500 text-gray-400 py-2 uppercase tracking-widest cursor-not-allowed"
          disabled
        >
          Out of Stock
        </button>
    )
  }

  return (
    <div className="group relative bg-brand-dark border border-brand-gold/20 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/10 hover:border-brand-gold/50 fade-in">
       {product.isPreOrder && (
        <div className="absolute top-4 left-4 z-10 bg-brand-gold text-black text-xs font-bold uppercase px-2 py-1 rounded-sm">
          Pre-Order
        </div>
      )}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={handleWishlistToggle} className="p-2 bg-black/50 rounded-full">
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden mb-4">
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" onContextMenu={(e) => e.preventDefault()} />
        </div>
        <h3 className="font-serif text-xl text-white truncate mb-2">{product.name}</h3>
        <p className="text-brand-gold text-lg font-semibold">
          {defaultVariant.discountedPrice ? (
            <>
              <span className="text-gray-400 line-through mr-2">₹{defaultVariant.price.toFixed(2)}</span>
              <span>₹{defaultVariant.discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span>₹{defaultVariant.price.toFixed(2)}</span>
          )}
        </p>
      </Link>
      {renderActionButon()}
    </div>
  );
};

export default ProductCard;
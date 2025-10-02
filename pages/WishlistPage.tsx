import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import * as storage from '../services/storageService';
import { Product } from '../types';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const allProducts = storage.getProducts();

  const wishlistProducts = wishlist
    .map(item => allProducts.find(p => p.id === item.productId))
    .filter((p): p is Product => p !== undefined);
    
  const handleMoveToCart = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      addToCart(product, defaultVariant);
      removeFromWishlist(product.id);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 fade-in">
      <h1 className="text-4xl font-serif text-center mb-12">My Wishlist</h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-6">Your wishlist is empty.</p>
          <Link to="/shop" className="bg-brand-gold text-black py-3 px-8 font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistProducts.map(product => {
            const defaultVariant = product.variants[0];
            return (
              <div key={product.id} className="group relative bg-brand-dark border border-brand-gold/20 p-4">
                <Link to={`/product/${product.id}`}>
                  <div className="overflow-hidden mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" onContextMenu={(e) => e.preventDefault()} />
                  </div>
                  <h3 className="font-serif text-xl text-white truncate">{product.name}</h3>
                  {defaultVariant && (
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
                  )}
                </Link>
                <div className="mt-4 flex flex-col space-y-2">
                   <button 
                      onClick={() => handleMoveToCart(product)} 
                      className="w-full bg-transparent border border-brand-gold text-brand-gold py-2 uppercase tracking-widest transition-all duration-300 hover:bg-brand-gold hover:text-black"
                    >
                      Move to Cart
                    </button>
                    <button onClick={() => removeFromWishlist(product.id)} className="w-full bg-transparent border border-red-500/50 text-red-400 py-2 uppercase tracking-widest text-sm transition-all duration-300 hover:bg-red-500 hover:text-white">
                      Remove
                    </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
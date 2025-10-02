import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as storage from '../services/storageService';
import { Product, ProductVariant } from '../types';
import { useStore } from '../hooks/useStore';
import { useFlyToCart } from '../hooks/useFlyToCart';
import NotFoundPage from './NotFoundPage';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useStore();
  const { fly } = useFlyToCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const actionBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (id) {
      const foundProduct = storage.getProductById(id);
      setProduct(foundProduct || null);
      if (foundProduct && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      }
    }
  }, [id]);

  if (!product || !selectedVariant) {
    return <NotFoundPage />;
  }
  
  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    if (actionBtnRef.current) {
      fly(actionBtnRef.current);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  
  const renderActionSection = () => {
    if (product.isPreOrder) {
      return (
        <div>
           <p className="text-brand-gold mb-4">This is a pre-order item. A 70% deposit will be charged at checkout.</p>
           <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-600">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-lg">-</button>
                <span className="px-4 py-2 text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-lg">+</button>
              </div>
              <button
                ref={actionBtnRef}
                onClick={handleAddToCart}
                disabled={isAdded}
                className="flex-grow bg-brand-deep text-white py-3 px-8 font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {isAdded ? 'Pre-ordered!' : `Pre-order Now (Pay ₹${((selectedVariant.discountedPrice ?? selectedVariant.price) * 0.7).toFixed(2)})`}
              </button>
            </div>
        </div>
      );
    }
    
    if (selectedVariant.stock > 0) {
      return (
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-600">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-lg">-</button>
            <span className="px-4 py-2 text-lg">{quantity}</span>
            <button onClick={() => setQuantity(Math.max(1, quantity + 1))} className="px-4 py-2 text-lg">+</button>
          </div>
          <button
            ref={actionBtnRef}
            onClick={handleAddToCart}
            disabled={isAdded}
            className="flex-grow bg-brand-gold text-black py-3 px-8 font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {isAdded ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      );
    }

    return (
       <div>
          <p className="text-brand-gold mb-4">Out of Stock.</p>
           <button type="submit" className="w-full bg-gray-700 text-gray-400 py-3 px-8 font-bold uppercase tracking-widest cursor-not-allowed" disabled>
              Out of Stock
           </button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="w-full relative">
           {product.isPreOrder && (
            <div className="absolute top-4 left-4 z-10 bg-brand-gold text-black text-sm font-bold uppercase px-3 py-1.5 rounded-sm">
              Pre-Order
            </div>
          )}
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg shadow-brand-gold/10" onContextMenu={(e) => e.preventDefault()} />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-5xl font-serif text-brand-gold mb-4">{product.name}</h1>
          <p className="text-2xl text-white mb-6">
            {selectedVariant.discountedPrice ? (
              <>
                <span className="text-gray-400 line-through mr-3">₹{selectedVariant.price.toFixed(2)}</span>
                <span>₹{selectedVariant.discountedPrice.toFixed(2)}</span>
              </>
            ) : (
              <span>₹{selectedVariant.price.toFixed(2)}</span>
            )}
          </p>
          <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>
          
          <div className="mb-8">
            <span className="uppercase text-sm text-gray-400">SIZE:</span>
             <div className="flex space-x-2 mt-2">
              {product.variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 border transition-colors duration-200 rounded-sm ${selectedVariant.id === variant.id ? 'bg-brand-gold text-black border-brand-gold' : 'bg-transparent border-gray-600 text-white hover:border-white'}`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          {renderActionSection()}
          
          {/* Simulated Reviews */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-2xl font-serif mb-4">Reviews</h3>
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <p className="font-semibold">★★★★★</p>
                <p className="text-gray-300 my-2">"Absolutely divine. This has become my signature scent. I get compliments everywhere I go."</p>
                <p className="text-sm text-gray-500">- Amelia R.</p>
              </div>
              <div className="border-b border-gray-800 pb-4">
                <p className="font-semibold">★★★★☆</p>
                <p className="text-gray-300 my-2">"A beautiful, long-lasting fragrance. A bit strong at first, but settles wonderfully."</p>
                <p className="text-sm text-gray-500">- Ben C.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
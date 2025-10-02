import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const CartPage: React.FC = () => {
  const { cart, cartTotal, updateCartQuantity, removeFromCart } = useStore();

  return (
    <div className="container mx-auto px-6 py-12 fade-in">
      <h1 className="text-4xl font-serif text-center mb-12">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-6">Your cart is currently empty.</p>
          <Link to="/shop" className="bg-brand-gold text-black py-3 px-8 font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.variantId} className="flex items-center bg-brand-dark p-4 border border-gray-800">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mr-6" onContextMenu={(e) => e.preventDefault()}/>
                  <div className="flex-grow">
                    <Link to={`/product/${item.productId}`} className="font-serif text-xl hover:text-brand-gold">{item.name}</Link>
                    <p className="text-gray-400 text-sm">{item.size}</p>
                    {item.isPreOrder ? (
                       <div>
                        <p className="text-sm text-brand-gold">70% Deposit: ₹{item.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">Full Price: ₹{item.fullPrice?.toFixed(2)}</p>
                        <span className="text-xs mt-1 inline-block bg-brand-gold text-black px-2 py-0.5 rounded">PRE-ORDER</span>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">₹{item.price.toFixed(2)}</p>
                    )}
                    <button onClick={() => removeFromCart(item.variantId)} className="text-red-500 hover:text-red-400 text-sm mt-1">Remove</button>
                  </div>
                  <div className="flex items-center border border-gray-600">
                    <button onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)} className="px-3 py-1">-</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)} className="px-3 py-1">+</button>
                  </div>
                  <p className="w-24 text-right font-semibold text-lg ml-6">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-brand-dark p-8 border border-gray-800 h-fit">
            <h2 className="text-2xl font-serif mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-400">Shipping</span>
              <span className="font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t border-gray-700 pt-4 mt-4">
              <span>Total</span>
              <span className="text-brand-gold">₹{cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="mt-8 block text-center w-full bg-brand-gold text-black py-3 font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
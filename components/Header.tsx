import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import AuthModal from './AuthModal';

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


const Header: React.FC = () => {
  const { cart, wishlist, currentUser } = useStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinkClasses = ({ isActive }: {isActive: boolean}) => 
    `text-sm tracking-wider uppercase transition-colors duration-300 hover:text-brand-gold ${isActive ? 'text-brand-gold' : 'text-white'}`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-md z-50 shadow-lg shadow-brand-gold/10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-serif text-brand-gold tracking-widest">
              VELVET NOCTURNE
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClasses}>Shop</NavLink>
            <NavLink to="/blog" className={navLinkClasses}>Blog</NavLink>
            <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
          </div>
          <div className="flex items-center space-x-5">
            <Link to="/wishlist" className="relative text-white hover:text-brand-gold transition-colors duration-300">
              <HeartIcon />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            <Link id="cart-icon" to="/cart" className="relative text-white hover:text-brand-gold transition-colors duration-300">
              <CartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
              )}
            </Link>
            {currentUser ? (
              <Link to="/account" className="text-white hover:text-brand-gold transition-colors duration-300">
                <UserIcon />
              </Link>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-white hover:text-brand-gold transition-colors duration-300">
                <UserIcon />
              </button>
            )}
          </div>
        </nav>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;

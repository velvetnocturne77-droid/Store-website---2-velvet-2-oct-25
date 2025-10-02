import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark border-t border-brand-gold/20 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif text-brand-gold mb-4">VELVET NOCTURNE</h3>
            <p className="text-sm">Timeless Scents for the Discerning Soul.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="hover:text-brand-gold transition-colors">Shop</Link></li>
              <li><Link to="/blog" className="hover:text-brand-gold transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/account" className="hover:text-brand-gold transition-colors">My Account</Link></li>
              <li><Link to="/policy-links" className="hover:text-brand-gold transition-colors">Our Policies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Customer Service</h4>
            <div className="text-sm space-y-1 text-gray-300">
              <p>No return of product.</p>
              <p>No cancellation after 24 hours of placing the order.</p>
              <p className="pt-2">For any inquiry, contact customer support:</p>
              <a href="tel:+917719697743" className="block hover:text-brand-gold transition-colors">+91 7719697743</a>
              <a href="mailto:velvetnocturne77@gmail.com" className="block hover:text-brand-gold transition-colors">velvetnocturne77@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Velvet Nocturne. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Replace with actual icons if needed */}
            <a href="#" className="hover:text-brand-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
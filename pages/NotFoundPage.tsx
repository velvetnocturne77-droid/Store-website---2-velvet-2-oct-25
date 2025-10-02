
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center px-6">
      <h1 className="text-9xl font-serif text-brand-gold">404</h1>
      <h2 className="text-4xl font-serif mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="bg-brand-gold text-black py-3 px-8 font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;

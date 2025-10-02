import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import ProductCard from '../components/ProductCard';
import * as storage from '../services/storageService';


const HomePage: React.FC = () => {
  const { products } = useStore();
  const featuredProducts = products;

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput.value;

    if (email) {
      const newSubscription = {
        id: Date.now().toString(),
        email,
        date: new Date().toISOString(),
      };
      
      const subscriptions = storage.getNewsletterSubscriptions();
      if (!subscriptions.some(s => s.email === email)) {
        storage.saveNewsletterSubscriptions([...subscriptions, newSubscription]);
      }
      alert(`Thank you for subscribing, ${email}!`);
      form.reset();
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center ken-burns" style={{ backgroundImage: "url('https://picsum.photos/id/128/1920/1080')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
        <div className="relative z-10 p-8">
          <h1 className="text-6xl md:text-8xl font-serif text-brand-gold drop-shadow-[0_5px_15px_rgba(212,175,55,0.3)]">Velvet Nocturne</h1>
          <p className="mt-4 text-xl md:text-2xl tracking-widest">Timeless Scents for the Discerning Soul</p>
          <Link to="/shop" className="group mt-8 inline-block border-2 border-brand-gold bg-transparent text-white py-3 px-8 font-bold uppercase tracking-widest transition-all duration-300 hover:bg-brand-gold hover:text-black hover:shadow-2xl hover:shadow-brand-gold/20">
            Discover Now
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 ml-2">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-brand-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-serif text-center mb-12 title-underline">Featured Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-4xl font-serif text-brand-gold mb-4">Join The Inner Circle</h2>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row max-w-lg mx-auto mt-8">
            <input 
              type="email" 
              name="email"
              className="flex-grow bg-gray-900 border border-gray-700 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 outline-none p-3 text-white mb-4 sm:mb-0 sm:mr-4 transition-all duration-300 rounded-sm"
              required
            />
            <button 
              type="submit" 
              className="group bg-transparent border-2 border-brand-gold text-brand-gold py-3 px-8 font-bold uppercase tracking-widest transition-all duration-300 hover:bg-brand-gold hover:text-black rounded-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
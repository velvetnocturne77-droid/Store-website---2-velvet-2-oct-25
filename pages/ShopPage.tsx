import React from 'react';
import { useStore } from '../hooks/useStore';
import ProductCard from '../components/ProductCard';

const ShopPage: React.FC = () => {
  const { products } = useStore();

  return (
    <div className="container mx-auto px-6 py-12 fade-in">
      <h1 className="text-5xl font-serif text-center mb-4">Our Collection</h1>
      <p className="text-center text-gray-400 mb-12">Explore our curated selection of fine fragrances.</p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
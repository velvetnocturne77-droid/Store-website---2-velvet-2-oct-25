import React from 'react';
import { Link } from 'react-router-dom';
import * as storage from '../services/storageService';

const BlogPage: React.FC = () => {
  const blogPosts = storage.getBlogPosts();

  return (
    <div className="container mx-auto px-6 py-12 fade-in">
      <h1 className="text-5xl font-serif text-center mb-4">Our Journal</h1>
      <p className="text-center text-gray-400 mb-12">Stories, insights, and inspirations from the world of Velvet Nocturne.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {blogPosts.map(post => (
          <div key={post.id} className="group bg-brand-dark border border-gray-800">
            <Link to={`/blog/${post.id}`}>
              <div className="overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" onContextMenu={(e) => e.preventDefault()} />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-2">{post.date} &bull; By {post.author}</p>
                <h2 className="text-2xl font-serif text-white group-hover:text-brand-gold transition-colors mb-3">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.summary}</p>
                <span className="font-semibold text-brand-gold uppercase tracking-wider text-sm">Read More</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
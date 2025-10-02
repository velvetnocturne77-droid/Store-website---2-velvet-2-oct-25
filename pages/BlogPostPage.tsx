import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as storage from '../services/storageService';
import { BlogPost } from '../types';
import NotFoundPage from './NotFoundPage';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (id) {
      const foundPost = storage.getBlogPostById(id);
      setPost(foundPost || null);
    }
  }, [id]);

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-6 py-20 fade-in max-w-4xl">
      <img src={post.image} alt={post.title} className="w-full h-96 object-cover mb-8" onContextMenu={(e) => e.preventDefault()} />
      <h1 className="text-5xl font-serif text-brand-gold mb-4">{post.title}</h1>
      <p className="text-gray-400 mb-8">By {post.author} on {post.date}</p>
      
      <div className="prose prose-invert prose-lg max-w-none text-gray-300">
        <p>{post.content}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  );
};

export default BlogPostPage;
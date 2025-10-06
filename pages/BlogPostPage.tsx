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
      
      <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line">
        {post.content}
      </div>
    </div>
  );
};

export default BlogPostPage;

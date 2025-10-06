import { Product, BlogPost } from '../types';

export const DATA_VERSION = 1;

export const mockProducts: Product[] = [
  { 
    id: '2', 
    name: 'Ember Woods', 
    description: 'A warm, smoky blend of sandalwood and cedar.', 
    image: 'https://picsum.photos/id/117/400/500', 
    variants: [
      { id: '2-100', size: '100ml', price: 200, discountedPrice: 180, stock: 5 },
      { id: '2-60', size: '60ml', price: 169, discountedPrice: 140, stock: 10 },
    ]
  },
  { 
    id: '3', 
    name: 'Gilded Oud', 
    description: 'An opulent and spicy fragrance with rare oud and saffron.', 
    image: 'https://picsum.photos/id/128/400/500',
    variants: [
      { id: '3-100', size: '100ml', price: 160, stock: 8 },
      { id: '3-50', size: '50ml', price: 120, stock: 12 },
    ]
  },
  { 
    id: '4', 
    name: 'Coastal Drift', 
    description: 'A fresh and invigorating scent of sea salt and sage.', 
    image: 'https://picsum.photos/id/145/400/500',
    isPreOrder: true,
    variants: [
      { id: '4-100', size: '100ml', price: 160, stock: 15 },
      { id: '4-50', size: '50ml', price: 120, discountedPrice: 100, stock: 20 },
    ]
  },
];

export const mockBlogPosts: BlogPost[] = [
  { id: '1', title: 'The Art of Perfumery: A Journey Through Scent', author: 'Elena Vostrova', date: 'October 26, 2023', summary: 'Discover the ancient traditions and modern innovations behind creating the world\'s most exquisite fragrances.', content: 'Perfumery is a craft that dates back thousands of years... (full content here)', image: 'https://picsum.photos/id/43/800/400' },
  { id: '2', title: 'Finding Your Signature Scent', author: 'Julien Dubois', date: 'November 5, 2023', summary: 'A personal guide to navigating the world of fragrances to find the one that truly represents you.', content: 'Your signature scent is a personal statement... (full content here)', image: 'https://picsum.photos/id/48/800/400' },
  { id: '3', title: 'Behind the Bottle: The Making of Midnight Bloom', author: 'Velvet Nocturne', date: 'November 18, 2023', summary: 'Go behind the scenes with our master perfumer to see how our flagship scent, Midnight Bloom, was born.', content: 'The creation of Midnight Bloom was a journey of passion... (full content here)', image: 'https://picsum.photos/id/106/800/400' },
];

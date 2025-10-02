import { Product, BlogPost, User, Order, CartItem, WishlistItem, ContactSubmission, NewsletterSubscription } from '../types';
import { mockProducts, mockBlogPosts } from './mockData';

const get = <T,>(key: string, defaultValue: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return defaultValue;
  }
};

const set = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage`, error);
  }
};

export const initData = () => {
  if (!localStorage.getItem('products')) {
    set('products', mockProducts);
  }
  if (!localStorage.getItem('blogPosts')) {
    set('blogPosts', mockBlogPosts);
  }
  if(!localStorage.getItem('users')){
    set('users', [{email: 'velvetnocturne77@gmail.com', password: 'ASHU77111488', isAdmin: true}])
  }
};

// Products
export const getProducts = (): Product[] => get('products', []);
export const getProductById = (id: string): Product | undefined => getProducts().find(p => p.id === id);
export const saveProducts = (products: Product[]): void => set('products', products);

// Blog Posts
export const getBlogPosts = (): BlogPost[] => get('blogPosts', []);
export const getBlogPostById = (id: string): BlogPost | undefined => getBlogPosts().find(p => p.id === id);
export const saveBlogPosts = (posts: BlogPost[]): void => set('blogPosts', posts);

// Cart
export const getCart = (): CartItem[] => get('cart', []);
export const saveCart = (cart: CartItem[]): void => set('cart', cart);

// Wishlist
export const getWishlist = (): WishlistItem[] => get('wishlist', []);
export const saveWishlist = (wishlist: WishlistItem[]): void => set('wishlist', wishlist);

// Users
export const getUsers = (): User[] => get('users', []);
export const saveUsers = (users: User[]): void => set('users', users);
export const getCurrentUser = (): User | null => get('currentUser', null);
export const saveCurrentUser = (user: User | null): void => set('currentUser', user);

// Orders
export const getOrders = (): Order[] => get('orders', []);
export const saveOrders = (orders: Order[]): void => set('orders', orders);

// Contact Submissions
export const getContactSubmissions = (): ContactSubmission[] => get('contactSubmissions', []);
export const saveContactSubmissions = (submissions: ContactSubmission[]): void => set('contactSubmissions', submissions);

// Newsletter Subscriptions
export const getNewsletterSubscriptions = (): NewsletterSubscription[] => get('newsletterSubscriptions', []);
export const saveNewsletterSubscriptions = (subscriptions: NewsletterSubscription[]): void => set('newsletterSubscriptions', subscriptions);
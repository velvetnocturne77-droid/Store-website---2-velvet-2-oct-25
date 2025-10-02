export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

export interface ProductVariant {
  id: string; // e.g., '2-100' for Ember Woods 100ml
  size: string; // "100ml", "60ml", "50ml"
  price: number;
  discountedPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  name:string;
  description: string;
  image: string;
  isPreOrder?: boolean;
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: string;
  price: number; // For pre-orders, this will be the 70% deposit
  quantity: number;
  isPreOrder?: boolean;
  fullPrice?: number; // The full price for pre-order items
}

export interface WishlistItem {
  productId: string;
}

export interface User {
  email: string;
  password?: string; // Stored hashed in a real app
  isAdmin: boolean;
  shippingAddress?: ShippingAddress;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalValue: number;
  amountPaid: number;
  date: string;
  shippingAddress: ShippingAddress;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Partially Paid';
  paymentId?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  image: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  date: string;
}
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, CartItem, WishlistItem, User, Order, ShippingAddress, ProductVariant } from '../types';
import * as storage from '../services/storageService';

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => boolean;
  orders: Order[];
  addOrder: (orderData: { id: string; userId: string; items: CartItem[]; total: number; shippingAddress: ShippingAddress; razorpayPaymentId: string; razorpayOrderId: string; }) => void;
  updateUserAddress: (address: ShippingAddress) => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    storage.initData();
    setProducts(storage.getProducts());
    setCart(storage.getCart());
    setWishlist(storage.getWishlist());
    setCurrentUser(storage.getCurrentUser());
    const user = storage.getCurrentUser();
    if (user) {
      setOrders(storage.getOrders().filter(o => o.userId === user.email));
    }
  }, []);

  const updateAndSaveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    storage.saveCart(newCart);
  };

  const updateAndSaveWishlist = (newWishlist: WishlistItem[]) => {
    setWishlist(newWishlist);
    storage.saveWishlist(newWishlist);
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    const existingItem = cart.find(item => item.variantId === variant.id);
    let newCart: CartItem[];
    
    const fullPrice = variant.discountedPrice ?? variant.price;
    const isPreOrder = product.isPreOrder ?? false;
    const price = isPreOrder ? fullPrice * 0.7 : fullPrice;

    if (existingItem) {
      newCart = cart.map(item =>
        item.variantId === variant.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newCart = [...cart, {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        image: product.image,
        size: variant.size,
        price,
        quantity,
        isPreOrder,
        fullPrice: isPreOrder ? fullPrice : undefined,
      }];
    }
    updateAndSaveCart(newCart);
  };

  const removeFromCart = (variantId: string) => {
    const newCart = cart.filter(item => item.variantId !== variantId);
    updateAndSaveCart(newCart);
  };
  
  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
    } else {
      const newCart = cart.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      );
      updateAndSaveCart(newCart);
    }
  };

  const clearCart = () => {
    updateAndSaveCart([]);
  };

  const addToWishlist = (productId: string) => {
    if (!isInWishlist(productId)) {
      const newWishlist = [...wishlist, { productId }];
      updateAndSaveWishlist(newWishlist);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(item => item.productId !== productId);
    updateAndSaveWishlist(newWishlist);
  };

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.productId === productId);
  }, [wishlist]);

  const login = (user: User) => {
    storage.saveCurrentUser(user);
    setCurrentUser(user);
    setOrders(storage.getOrders().filter(o => o.userId === user.email));
  };

  const logout = () => {
    storage.saveCurrentUser(null);
    setCurrentUser(null);
    setOrders([]);
  };

  const register = (newUser: User): boolean => {
    const users = storage.getUsers();
    if (users.some(u => u.email === newUser.email)) {
      return false; // User already exists
    }
    const updatedUsers = [...users, { ...newUser, isAdmin: false }];
    storage.saveUsers(updatedUsers);
    login(newUser);
    return true;
  };

  const addOrder = (orderData: { id: string; userId: string; items: CartItem[]; total: number; shippingAddress: ShippingAddress; razorpayPaymentId: string; razorpayOrderId: string; }) => {
    const allOrders = storage.getOrders();
    
    const totalValue = orderData.items.reduce((sum, item) => {
      const price = item.fullPrice ?? item.price;
      return sum + (price * item.quantity);
    }, 0);
    const amountPaid = orderData.total;
    const isPartiallyPaid = amountPaid < totalValue;

    const newOrder: Order = {
      id: orderData.id,
      date: new Date().toISOString(),
      status: isPartiallyPaid ? 'Partially Paid' : 'Pending',
      statusNotes: isPartiallyPaid ? undefined : 'Will be confirmed under 24 hours and shipped in 14 days. You will be notified through WhatsApp and Call',
      userId: orderData.userId,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      totalValue,
      amountPaid,
      razorpayPaymentId: orderData.razorpayPaymentId,
      razorpayOrderId: orderData.razorpayOrderId,
    };

    const updatedOrders = [...allOrders, newOrder];
    storage.saveOrders(updatedOrders);

    if(currentUser) {
      // Update user's address in the main user list and in the current session
      const users = storage.getUsers();
      const updatedUsers = users.map(user => 
        user.email === currentUser.email 
          ? { ...user, shippingAddress: orderData.shippingAddress } 
          : user
      );
      storage.saveUsers(updatedUsers);

      const updatedCurrentUser = { ...currentUser, shippingAddress: orderData.shippingAddress };
      storage.saveCurrentUser(updatedCurrentUser);
      setCurrentUser(updatedCurrentUser);

      if(newOrder.userId === currentUser.email) {
        setOrders(prev => [...prev, newOrder]);
      }
    }
    
    clearCart();
  };
  
  const updateUserAddress = (address: ShippingAddress) => {
    if (currentUser) {
      const updatedCurrentUser = { ...currentUser, shippingAddress: address };
      setCurrentUser(updatedCurrentUser);
      storage.saveCurrentUser(updatedCurrentUser);

      const users = storage.getUsers();
      const updatedUsers = users.map(u => u.email === currentUser.email ? updatedCurrentUser : u);
      storage.saveUsers(updatedUsers);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    products,
    setProducts,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    currentUser,
    login,
    logout,
    register,
    orders,
    addOrder,
    updateUserAddress,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
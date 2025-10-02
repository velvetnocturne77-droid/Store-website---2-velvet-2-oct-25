import { useContext } from 'react';
import { FlyToCartContext } from '../pages/FlyToCartContext';

export const useFlyToCart = () => {
  const context = useContext(FlyToCartContext);
  if (context === undefined) {
    throw new Error('useFlyToCart must be used within a FlyToCartProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTracking } from 'react-user-tracking';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { trackEvent } = useTracking();

  const addToCart = (product: Product) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        // Track cart update event
        trackEvent('cart_update', {
          metadata: {
            action: 'increase_quantity',
            productId: product.id,
            productName: product.name,
            newQuantity: existing.quantity + 1
          }
        });

        // increment quantity
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1} : item);
      } else {
        // Track add to cart event
        trackEvent('cart_update', {
          metadata: {
            action: 'add_item',
            productId: product.id,
            productName: product.name,
            price: product.price
          }
        });

        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.id === productId);

      if (existing && existing.quantity > 1) {
        trackEvent('cart_update', {
          metadata: {
            action: 'decrease_quantity',
            productId: productId,
            productName: existing.name,
            newQuantity: existing.quantity - 1
          }
        });

        return prevItems.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1} : item);

      } else {
        if (existing) {
          trackEvent('cart_update', {
            metadata: {
              action: 'remove_item',
              productId: productId,
              productName: existing.name
            }
          });
        }

        return prevItems.filter(item => item.id !== productId);
      }
    });
  };

  const clearCart = () => {
    trackEvent('cart_update', {
      metadata: {
        action: 'clear_cart',
        itemCount: items.length
      }
    });

    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

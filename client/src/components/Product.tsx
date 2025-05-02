import React, { useRef } from 'react';
import { useTracking, useClickTracking } from 'react-user-tracking';
import TrackableButton from './TrackableButton.tsx';

const Product = ({ product }) => {
  const { trackEvent } = useTracking();
  // Use tracking hook
  
  const handleAddToCart = () => {
    // Additional manual tracking if needed
    trackEvent('cart_update', {
      metadata: {
        action: 'add_item',
        productId: product.id,
        productName: product.name,
        price: product.price
      }
    });
  };
  
  return (
    <div className="product-item">
      <div className="product-image">PRODUCT IMAGE</div>
      <div className="product-info">
        <div className="product-title">{product.name}</div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <TrackableButton onClick={handleAddToCart} 
          category="product"
          label="wishlist"
        >
          ADD TO CART
        </TrackableButton>
      </div>
    </div>
  );
};

export default Product;

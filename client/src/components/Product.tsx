import React from 'react';
import { useTracking } from 'react-user-tracking';
import TrackableButton from './TrackableButton';

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
  };
}

const Product = ({ product }: ProductProps) => {
  const { trackEvent } = useTracking();
  
  const handleAddToCart = () => {
    // Track the add to cart event
    trackEvent('cart_update', {
      metadata: {
        action: 'add_item',
        productId: product.id,
        productName: product.name,
        price: product.price
      }
    });
    
    console.log('Added to cart:', product);
  };
  
  return (
    <div className="product-item">
      <div className="product-image">PRODUCT IMAGE</div>
      <div className="product-info">
        <div className="product-title">{product.name}</div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <TrackableButton 
          onClick={handleAddToCart} 
          category="product"
          label="add_to_cart"
        >
          ADD TO CART
        </TrackableButton>
      </div>
    </div>
  );
};

export default Product;

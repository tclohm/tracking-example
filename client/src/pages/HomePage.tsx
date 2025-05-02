import React, { useRef } from 'react';
import { usePageViewTracking, useClickTracking } from 'react-user-tracking';

import Product from '../components/Product';

const HomePage = () => {
  // Track page view
  usePageViewTracking();
  
  const products = [
    { id: 1, name: 'WORK JACKET', price: 129.99 },
    { id: 2, name: 'UTILITY PANTS', price: 89.99 },
    { id: 3, name: 'LOGO T-SHIRT', price: 39.99 },
    { id: 4, name: 'CANVAS CAP', price: 29.99 }
  ];
  
  return (
    <div>
      <main>
        <div className="container">
          <h1>PRODUCTS</h1>
          <p className="monospace">
            A COLLECTION OF PRODUCTS TO DEMONSTRATE USER TRACKING
          </p>
          
          <div className="product-grid">
            {products.map(product => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

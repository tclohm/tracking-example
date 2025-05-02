import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { usePageViewTracking, useClickTracking } from 'react-user-tracking';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const Hero = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.dark};
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.dark};
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const ShopButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const shopButtonRef = useRef<HTMLButtonElement>(null);
  
  // Track page view
  usePageViewTracking();
  
  // Track shop button clicks
  useClickTracking(shopButtonRef, 'cta', 'shop_now');
  
  return (
    <HomeContainer>
      <Hero>
        <Title>Welcome to TrackShop</Title>
        <Subtitle>
          A demo shop showcasing the react-user-tracking library. 
          Browse our products and see tracking in action!
        </Subtitle>
        <ShopButton 
          ref={shopButtonRef}
          onClick={() => navigate('/shop')}
        >
          Shop Now
        </ShopButton>
      </Hero>
      
      <Features>
        <FeatureCard>
          <h3>High-Quality Products</h3>
          <p>
            Our shop features a curated selection of premium products 
            that demonstrate various tracking capabilities.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>User Behavior Tracking</h3>
          <p>
            See how your interactions are being tracked in real-time
            with the debug toast in the bottom-right corner.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>Privacy First</h3>
          <p>
            All tracking is completely transparent and only used to 
            improve the shopping experience.
          </p>
        </FeatureCard>
      </Features>
    </HomeContainer>
  );
};

export default HomePage;

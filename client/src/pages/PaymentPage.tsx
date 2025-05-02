import React, { useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { usePageViewTracking, useFormTracking, useClickTracking } from 'react-user-tracking';

const PaymentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1.5fr 1fr;
  }
`;

const PageTitle = styled.h1`
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.dark};
  grid-column: 1 / -1;
`;

const CartSection = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const CartTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.dark};
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.dark};
`;

const CartTotal = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.light};
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
`;

const PaymentSection = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const PaymentTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.dark};
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${props => props.theme.colors.dark};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.light};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.light};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.light};
    color: ${props => props.theme.colors.dark};
    cursor: not-allowed;
  }
`;

const ContinueShoppingButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.light};
  }
`;

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const continueShoppingRef = useRef<HTMLButtonElement>(null);
  
  // Track page view
  usePageViewTracking();
  
  // Track form submission
  useFormTracking(formRef, 'payment');
  
  // Track continue shopping button clicks
  useClickTracking(continueShoppingRef, 'navigation', 'continue_shopping');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would process payment here
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };
  
  return (
    <PaymentContainer>
      <PageTitle>Checkout</PageTitle>
      
      <CartSection>
        <CartTitle>Your Cart</CartTitle>
        
        {items.length === 0 ? (
          <EmptyCart>
            <p>Your cart is empty.</p>
            <ContinueShoppingButton 
              ref={continueShoppingRef}
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </ContinueShoppingButton>
          </EmptyCart>
        ) : (
          <>
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
            
            <CartTotal>
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </CartTotal>
          </>
        )}
      </CartSection>
      
      <PaymentSection>
        <PaymentTitle>Payment Details</PaymentTitle>
        
        <PaymentForm ref={formRef} onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="John Doe" 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="john@example.com" 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="card">Card Number</Label>
            <Input 
              type="text" 
              id="card" 
              name="card" 
              placeholder="4242 4242 4242 4242" 
              required 
            />
          </FormGroup>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input 
                type="text" 
                id="expiry" 
                name="expiry" 
                placeholder="MM/YY" 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="cvc">CVC</Label>
              <Input 
                type="text" 
                id="cvc" 
                name="cvc" 
                placeholder="123" 
                required 
              />
            </FormGroup>
          </div>
          
          <FormGroup>
            <Label htmlFor="country">Country</Label>
            <Select id="country" name="country" required>
              <option value="">Select Country</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="au">Australia</option>
            </Select>
          </FormGroup>
          
          <SubmitButton 
            type="submit" 
            disabled={items.length === 0}
          >
            {items.length === 0 ? 'Cart is Empty' : `Pay $${getCartTotal().toFixed(2)}`}
          </SubmitButton>
        </PaymentForm>
      </PaymentSection>
    </PaymentContainer>
  );
};

export default PaymentPage;

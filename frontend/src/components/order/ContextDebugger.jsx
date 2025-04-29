// ContextDebugger.jsx
import { useCart } from '../context/CartContext';

export const ContextDebugger = () => {
  const { cartItems } = useCart();
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      background: 'white',
      padding: '1rem',
      zIndex: 1000,
      border: '1px solid red'
    }}>
      <h3>Cart Context Debug</h3>
      <pre>{JSON.stringify(cartItems, null, 2)}</pre>
    </div>
  );
};
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h2 className='mb-4 text-2xl font-bold text-gray-700'>Your cart is empty</h2>
        <Link to='/' className='font-semibold text-green-600 hover:underline'>
          Go back to restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <div className='max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md'>
        <h2 className='mb-6 text-2xl font-bold text-gray-800'>Your Cart</h2>

        <div className='space-y-4'>
          {cartItems.map((item) => (
            <div key={item._id} className='flex items-center justify-between pb-4 border-b'>
              <div>
                <h3 className='font-semibold text-gray-800'>{item.name}</h3>
                <p className='text-sm text-gray-500'>Rs {item.price}</p>
              </div>

              <div className='flex items-center gap-4'>
                <input
                  type='number'
                  min='1'
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                  className='w-16 p-2 text-gray-800 border border-gray-300 rounded-md'
                />
                <button onClick={() => removeFromCart(item._id)} className='font-semibold text-red-500 hover:underline'>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between mt-8'>
          <h3 className='text-lg font-bold text-gray-800'>Total: Rs {totalAmount.toFixed(2)}</h3>
          <Link to='/checkout' className='px-6 py-2 font-bold text-white transition bg-green-500 rounded-md hover:bg-green-600'>
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

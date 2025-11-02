import React from 'react';
import { useCart } from '../../hooks/useCart';
import Button from '../Button';
import { IconTrash } from '../../constants';
import QuantityControl from '../QuantityControl';

interface CartViewProps {
    onCheckout: () => void;
    onBrowseMenu: () => void;
}

const CartView: React.FC<CartViewProps> = ({ onCheckout, onBrowseMenu }) => {
  const { cartItems, closeCart, removeItem, updateQuantity, totalPrice, cartCount } = useCart();

  const handleCheckout = () => {
    closeCart();
    onCheckout();
  };
  
  const handleBrowseMenu = () => {
    closeCart();
    onBrowseMenu();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fade-in" onClick={closeCart}>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 h-full flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Your Cart ({cartCount})</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl">&times;</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <p className="text-lg text-gray-500 dark:text-gray-400">Your cart is empty.</p>
            <Button onClick={handleBrowseMenu} className="mt-4">Start Ordering</Button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-4">
              {cartItems.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center space-x-4 mb-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹ {item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                       <QuantityControl
                          quantity={quantity}
                          onIncrease={() => updateQuantity(item.id, quantity + 1)}
                          onDecrease={() => updateQuantity(item.id, quantity - 1)}
                       />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">₹ {(item.price * quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 mt-2">
                        <IconTrash/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-gray-200">
                <span>Subtotal</span>
                <span>₹ {totalPrice.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full text-lg">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartView;
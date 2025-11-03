
import React from 'react';
import { MenuItem, MenuItemStatus } from '../types.ts';
import { useCart } from '../hooks/useCart.tsx';
import Button from './Button.tsx';
import QuantityControl from './QuantityControl.tsx';
import { IconClose } from '../constants.tsx';

interface MenuItemDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

const MenuItemDetailModal: React.FC<MenuItemDetailModalProps> = ({ item, onClose }) => {
  const { cartItems, addItem, updateQuantity } = useCart();
  const cartItem = cartItems.find(ci => ci.item.id === item.id);
  const isAvailable = item.status === MenuItemStatus.Available;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden animate-zoom-in"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white md:text-gray-500 bg-black bg-opacity-50 md:bg-transparent rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
        >
          <IconClose />
        </button>
        <div className="w-full md:w-1/2">
          <img src={item.imageUrl} alt={item.name} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <span className="text-sm font-semibold text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50 px-3 py-1 rounded-full self-start mb-2">{item.category}</span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{item.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 flex-grow mb-6">{item.description}</p>
          
          <div className="mt-auto flex justify-between items-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">₹{item.price.toFixed(2)}</span>
            
            {isAvailable ? (
                cartItem ? (
                    <QuantityControl
                        quantity={cartItem.quantity}
                        onIncrease={() => updateQuantity(item.id, cartItem.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, cartItem.quantity - 1)}
                        size="large"
                    />
                ) : (
                    <Button onClick={() => addItem(item)} className="px-6 py-3 text-base">
                        Add to Cart
                    </Button>
                )
            ) : (
                <span className="px-6 py-3 text-base font-semibold text-white bg-gray-500 rounded-md">Unavailable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetailModal;
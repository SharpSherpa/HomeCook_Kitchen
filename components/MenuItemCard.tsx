
import React from 'react';
import { MenuItem, MenuItemStatus } from '../types.ts';
import Button from './Button.tsx';
import { useCart } from '../hooks/useCart.tsx';
import QuantityControl from './QuantityControl.tsx';

interface MenuItemCardProps {
  item: MenuItem;
  onItemClick: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onItemClick }) => {
  const { addItem, updateQuantity, cartItems } = useCart();
  const isAvailable = item.status === MenuItemStatus.Available;
  const cartItem = cartItems.find(ci => ci.item.id === item.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
  };

  const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
      e.stopPropagation();
      updateQuantity(item.id, newQuantity);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group flex flex-col cursor-pointer"
      onClick={() => onItemClick(item)}
    >
      <div className="relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Unavailable</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-300 shadow">
            {item.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate">{item.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow mb-4 line-clamp-2">{item.description}</p>
        <div className="mt-auto flex justify-between items-center">
          <span className="text-lg font-bold text-orange-600 dark:text-orange-500">₹{item.price.toFixed(2)}</span>
          {cartItem ? (
            <QuantityControl
                quantity={cartItem.quantity}
                onIncrease={(e) => handleQuantityChange(e, cartItem.quantity + 1)}
                onDecrease={(e) => handleQuantityChange(e, cartItem.quantity - 1)}
            />
          ) : (
            <Button onClick={handleAddToCart} disabled={!isAvailable} className="px-4 py-2 text-sm">
                Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
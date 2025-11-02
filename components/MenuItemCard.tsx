import React from 'react';
import { MenuItem, MenuItemStatus } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onItemClick: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onItemClick }) => {
  const isAvailable = item.status === MenuItemStatus.Available;

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-110 group flex flex-col cursor-pointer"
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
          <span className="text-lg font-bold text-orange-600 dark:text-orange-500">₹ {item.price.toFixed(2)}</span>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
import React, { useState, useMemo } from 'react';
import { MenuItem, MenuItemStatus } from '../../types';
import MenuItemCard from '../MenuItemCard';
import Spinner from '../Spinner';
import MenuItemDetailModal from '../MenuItemDetailModal';

interface MenuPageProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  headerHeight: number;
}

const MenuPage: React.FC<MenuPageProps> = ({ menuItems, isLoading, headerHeight }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MenuItemStatus | 'all'>('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    return menuItems
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(item => statusFilter === 'all' || item.status === statusFilter)
      .filter(item => item.price <= priceRange);
  }, [menuItems, searchTerm, statusFilter, priceRange]);
  
  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pt-12 mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Our Menu</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Explore our wide range of delicious homemade dishes.</p>
        </div>
        
        {/* Sticky wrapper for filters */}
        <div 
          className="md:sticky bg-gray-100 dark:bg-gray-950 z-30 py-4"
          style={{ top: `${headerHeight}px` }}
        >
          {/* Filters */}
          <div 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
          >
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Search for a dish..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as MenuItemStatus | 'all')}
              >
                <option value="all">All Items</option>
                <option value={MenuItemStatus.Available}>Available</option>
                <option value={MenuItemStatus.Unavailable}>Unavailable</option>
              </select>
            </div>
            <div className="col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price: ₹ {priceRange}</label>
              <input
                id="price"
                type="range"
                min="0"
                max="1000"
                step="50"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="py-12">
          {isLoading ? (
            <Spinner />
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} onItemClick={handleItemClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold mb-2">The kitchen is getting ready!</h3>
              <p className="text-gray-500 dark:text-gray-400">The admin hasn't added any menu items yet. Please check back soon.</p>
            </div>
          )}
        </div>
      </div>
      {selectedItem && (
          <MenuItemDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default MenuPage;
import React, { useState } from 'react';
import { Page, User, UserRole } from '../types';
import { RESTAURANT_NAME, IconCart, IconMenu, IconClose } from '../constants';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  user: User | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
  onDeleteOwnAccount: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenLoginModal, onLogout, onNavigate, isAdmin, onDeleteOwnAccount }) => {
  const { cartCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="text-3xl font-bold text-orange-600 dark:text-orange-500 cursor-pointer"
            onClick={() => handleNavClick(Page.Home)}
          >
            {RESTAURANT_NAME}
          </div>
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={() => handleNavClick(Page.Home)} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Home</button>
            <button onClick={() => handleNavClick(Page.Menu)} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Menu</button>
            {isAdmin && <button onClick={() => handleNavClick(Page.Admin)} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Admin Dashboard</button>}
          </nav>
          <div className="flex items-center space-x-4">
            <button onClick={openCart} className="relative text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
              <IconCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                  <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">Hi, {user.mobileNumber}</span>
                       {user.role === UserRole.Customer && (
                           <button onClick={onDeleteOwnAccount} className="px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors">
                              Delete Account
                          </button>
                      )}
                      <button onClick={onLogout} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                          Logout
                      </button>
                  </div>
              ) : (
                <button onClick={onOpenLoginModal} className="px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 transition-colors text-sm font-medium">
                  Login / Sign Up
                </button>
              )}
            </div>
            <div className="lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500">
                {isMobileMenuOpen ? <IconClose /> : <IconMenu />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-2 px-4 py-4">
                <button onClick={() => handleNavClick(Page.Home)} className="text-left py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Home</button>
                <button onClick={() => handleNavClick(Page.Menu)} className="text-left py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Menu</button>
                {isAdmin && <button onClick={() => handleNavClick(Page.Admin)} className="text-left py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Admin Dashboard</button>}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  {user ? (
                      <div className="flex flex-col space-y-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as {user.mobileNumber}</p>
                           {user.role === UserRole.Customer && (
                               <button onClick={onDeleteOwnAccount} className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors text-left">
                                  Delete Account
                              </button>
                          )}
                          <button onClick={onLogout} className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                              Logout
                          </button>
                      </div>
                  ) : (
                    <button onClick={() => { onOpenLoginModal(); setIsMobileMenuOpen(false); }} className="w-full px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 transition-colors text-sm font-medium">
                      Login / Sign Up
                    </button>
                  )}
                </div>
            </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
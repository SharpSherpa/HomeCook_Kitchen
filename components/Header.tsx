import React, { useState, forwardRef } from 'react';
import { Page, User } from '../types';
import { RESTAURANT_NAME, IconMenu, IconClose } from '../constants';

interface HeaderProps {
  user: User | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}

const Header = forwardRef<HTMLElement, HeaderProps>(({ user, onOpenLoginModal, onLogout, onNavigate, isAdmin }, ref) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header ref={ref} className="bg-white dark:bg-gray-900 shadow-md fixed top-0 w-full z-40">
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
            <button onClick={() => handleNavClick(Page.Pay)} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Pay Now</button>
            {isAdmin && <button onClick={() => handleNavClick(Page.Admin)} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Admin</button>}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center">
              {user ? (
                  <button onClick={onLogout} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                      Logout
                  </button>
              ) : (
                <button onClick={onOpenLoginModal} className="px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 transition-colors text-sm font-medium">
                  Admin Login
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
                <button onClick={() => handleNavClick(Page.Pay)} className="text-left py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Pay Now</button>
                {isAdmin && <button onClick={() => handleNavClick(Page.Admin)} className="text-left py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">Admin</button>}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  {user ? (
                      <button onClick={onLogout} className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium">
                          Logout
                      </button>
                  ) : (
                    <button onClick={() => { onOpenLoginModal(); setIsMobileMenuOpen(false); }} className="w-full px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 transition-colors text-sm font-medium">
                      Admin Login
                    </button>
                  )}
                </div>
            </nav>
        </div>
      )}
    </header>
  );
});

export default Header;
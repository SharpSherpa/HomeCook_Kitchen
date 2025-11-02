import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, UserRole, User, ContactInfo, MenuItem as MenuItemType } from './types';
import { fetchMenuItems, updateContactInfo as apiUpdateContactInfo, updateMenuItem as apiUpdateMenuItem, addMenuItem as apiAddMenuItem, loginUser } from './services/api';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import MenuPage from './components/pages/MenuPage';
import PayPage from './components/pages/PayPage';
import AdminDashboard from './components/pages/AdminDashboard';
import LoginModal from './components/LoginModal';
import Spinner from './components/Spinner';

// Custom hook to get the previous value of a state or prop
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [user, setUser] = useState<User | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const isAdmin = user?.role === UserRole.Admin || user?.role === UserRole.RootAdmin;

  const prevUser = usePrevious(user);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setHeaderHeight(entry.target.getBoundingClientRect().height);
      }
    });

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('homecook-user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    if (parsedUser) {
      setUser(parsedUser);
    }

    Promise.all([
      fetchMenuItems(),
      apiUpdateContactInfo(), // This also fetches initial info
    ]).then(([items, info]) => {
      setMenuItems(items);
      setContactInfo(info);
      setIsLoading(false);
    });
    
  }, []);

  const navigateTo = useCallback((page: Page, sectionId?: string) => {
    if (page === currentPage && !sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    
    setTimeout(() => {
        if (sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, 50);
  }, [currentPage]);
  
  // This effect handles navigation AFTER a successful login to avoid race conditions.
  useEffect(() => {
    if (!prevUser && user) {
      const userIsAdmin = user.role === UserRole.Admin || user.role === UserRole.RootAdmin;
      if (userIsAdmin) {
        navigateTo(Page.Admin);
      }
    }
  }, [user, prevUser, navigateTo]);

  // This effect acts as a ROUTE GUARD, protecting admin page from unauthorized access.
  useEffect(() => {
    if (isLoading) return;

    if (currentPage === Page.Admin && !isAdmin) {
        navigateTo(Page.Home);
    }
  }, [currentPage, isAdmin, isLoading, navigateTo]);


  const handleAdminLoginAttempt = async (username: string, password: string): Promise<string | void> => {
    const result = await loginUser(username, password);

    if (result.user) {
        setUser(result.user);
        localStorage.setItem('homecook-user', JSON.stringify(result.user));
        setIsLoginModalOpen(false);
    } else {
        return result.error || "An unknown error occurred.";
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('homecook-user');
    navigateTo(Page.Home);
  };
  
  const handleUpdateContactInfo = async (newInfo: ContactInfo) => {
    const updatedInfo = await apiUpdateContactInfo(newInfo);
    setContactInfo(updatedInfo);
  };
  
  const handleUpdateMenuItem = async (updatedItem: MenuItemType) => {
    const originalMenuItems = menuItems;
    // Optimistically update the UI for an instant feel
    setMenuItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    try {
        // Update in the backend
        const newItems = await apiUpdateMenuItem(updatedItem);
        // Resync with the "DB" state to ensure consistency
        setMenuItems(newItems);
    } catch (error) {
        console.error("Failed to update item:", error);
        // Rollback on error
        setMenuItems(originalMenuItems);
        alert("Failed to update item. Please try again.");
    }
  };
  
  const handleAddMenuItem = async (newItem: Omit<MenuItemType, 'id'>) => {
    const newItems = await apiAddMenuItem(newItem);
    setMenuItems(newItems);
  };

  const renderContent = () => {
    if (isLoading || !contactInfo) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;

    switch (currentPage) {
      case Page.Home:
        return <HomePage onOrderNow={() => navigateTo(Page.Menu)} featuredItems={menuItems.slice(0, 4)} contactInfo={contactInfo} />;
      case Page.Menu:
        return <MenuPage menuItems={menuItems} isLoading={isLoading} headerHeight={headerHeight} />;
      case Page.Pay:
        return <PayPage contactInfo={contactInfo} />;
      case Page.Admin:
        if (!isAdmin) {
          // The route guard will redirect, but show a spinner in the meantime.
          return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
        }
        return (
          <AdminDashboard 
            menuItems={menuItems}
            contactInfo={contactInfo}
            onUpdateContactInfo={handleUpdateContactInfo}
            onUpdateMenuItem={handleUpdateMenuItem}
            onAddMenuItem={handleAddMenuItem}
          />
        );
      default:
        return <HomePage onOrderNow={() => navigateTo(Page.Menu)} featuredItems={menuItems.slice(0, 4)} contactInfo={contactInfo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header 
        ref={headerRef}
        user={user} 
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onNavigate={navigateTo}
        isAdmin={isAdmin}
      />
      <main className="flex-grow" style={{ paddingTop: `${headerHeight}px` }}>
        {renderContent()}
      </main>
      {contactInfo && <Footer contactInfo={contactInfo} onNavigate={navigateTo} />}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onAuthAttempt={handleAdminLoginAttempt} />}
    </div>
  );
};

export default App;
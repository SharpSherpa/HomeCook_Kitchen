
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, UserRole, User, ContactInfo, MenuItem as MenuItemType, Order } from './types.ts';
import { fetchMenuItems, updateContactInfo as apiUpdateContactInfo, updateMenuItem as apiUpdateMenuItem, addMenuItem as apiAddMenuItem, loginUser, registerUser, fetchOrders, deleteMenuItem as apiDeleteMenuItem, updateOrderStatus as apiUpdateOrderStatus, fetchAllUsers, addAdminUser, deleteUser } from './services/api.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './components/pages/HomePage.tsx';
import MenuPage from './components/pages/MenuPage.tsx';
import CheckoutPage from './components/pages/CheckoutPage.tsx';
import OrderSuccessPage from './components/pages/OrderSuccessPage.tsx';
import AdminDashboard from './components/pages/AdminDashboard.tsx';
import CartView from './components/pages/CartView.tsx';
import LoginModal from './components/LoginModal.tsx';
import { useCart } from './hooks/useCart.tsx';
import Spinner from './components/Spinner.tsx';

// Custom hook to get the previous value of a state or prop
const usePrevious = <T,>(value: T): T | undefined => {
  // FIX: `useRef` requires an initial value. Provide `undefined` and update the generic type.
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isCartOpen, closeCart } = useCart();
  
  const isAdmin = user?.role === UserRole.Admin || user?.role === UserRole.RootAdmin;
  const isRootAdmin = user?.role === UserRole.RootAdmin;

  const prevUser = usePrevious(user);

  useEffect(() => {
    const savedUser = localStorage.getItem('homecook-user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    if (parsedUser) {
      setUser(parsedUser);
      if (parsedUser.role === UserRole.RootAdmin) {
        fetchAllUsers().then(setAllUsers);
      }
    }

    Promise.all([
      fetchMenuItems(),
      apiUpdateContactInfo(),
      fetchOrders(),
    ]).then(([items, info, fetchedOrders]) => {
      setMenuItems(items);
      setContactInfo(info);
      setOrders(fetchedOrders);
      setIsLoading(false);
    });
    
  }, []);

  const navigateTo = useCallback((page: Page, sectionId?: string) => {
    closeCart();
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
  }, [closeCart, currentPage]);
  
  // This effect handles navigation AFTER a successful login to avoid race conditions.
  useEffect(() => {
    // We only want to react to the user logging IN (prevUser is undefined/null, user is not)
    if (!prevUser && user) {
      const userIsAdmin = user.role === UserRole.Admin || user.role === UserRole.RootAdmin;
      if (userIsAdmin) {
        // The user state is confirmed, NOW we can safely navigate to the admin page.
        navigateTo(Page.Admin);
      }
    }
  }, [user, prevUser, navigateTo]);

  // This effect acts as a ROUTE GUARD, protecting pages from unauthorized access.
  useEffect(() => {
    if (isLoading) return;

    if (currentPage === Page.Checkout && !user) {
        navigateTo(Page.Menu);
        setIsLoginModalOpen(true);
    }

    // If the current page is Admin but the (now updated) user is NOT an admin, redirect home.
    if (currentPage === Page.Admin && !isAdmin) {
        navigateTo(Page.Home);
    }
  }, [currentPage, isAdmin, isLoading, navigateTo, user]);


  const handleAuthAttempt = async (mode: 'login' | 'signup', mobileNumber: string, password: string): Promise<string | void> => {
    const ADMIN_PASSWORD_CLIENT = 'AdMin786@12';
    let result: { user: User | null; error?: string };

    // Smartly handle users trying to sign up with admin credentials.
    // This prevents creating a customer account with the admin password and instead logs them in.
    if (mode === 'signup' && password === ADMIN_PASSWORD_CLIENT) {
        result = await loginUser(mobileNumber, password);
         // Provide a specific error if the login fails, guiding the user.
        if (result.error) {
            return `Admin login failed. Please ensure you are using the correct admin mobile number.`;
        }
    } else if (mode === 'login') {
      result = await loginUser(mobileNumber, password);
    } else {
      result = await registerUser(mobileNumber, password);
    }

    if (result.user) {
        setUser(result.user); // This state change triggers the navigation useEffect above.
        localStorage.setItem('homecook-user', JSON.stringify(result.user));
        
        if (result.user.role === UserRole.RootAdmin) {
          fetchAllUsers().then(setAllUsers);
        }
        
        setIsLoginModalOpen(false);
    } else {
        return result.error || "An unknown error occurred.";
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAllUsers([]);
    localStorage.removeItem('homecook-user');
    navigateTo(Page.Home);
  };
  
  const handleUpdateContactInfo = async (newInfo: ContactInfo) => {
    const updatedInfo = await apiUpdateContactInfo(newInfo);
    setContactInfo(updatedInfo);
  };
  
  const handleUpdateMenuItem = async (updatedItem: MenuItemType) => {
    const newItems = await apiUpdateMenuItem(updatedItem);
    setMenuItems(newItems);
  };
  
  const handleAddMenuItem = async (newItem: Omit<MenuItemType, 'id'>) => {
    const newItems = await apiAddMenuItem(newItem);
    setMenuItems(newItems);
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    try {
        await apiDeleteMenuItem(itemId);
        setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
        console.error("Error in App.tsx -> handleDeleteMenuItem:", error);
        throw error; // Re-throw the error for the UI component to handle
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updatedOrders = await apiUpdateOrderStatus(orderId, status);
    setOrders(updatedOrders);
  };
  
  const handleAddAdmin = async (mobileNumber: string, password: string): Promise<void> => {
    try {
        const updatedUsers = await addAdminUser(mobileNumber, password);
        setAllUsers(updatedUsers);
    } catch (error) {
        console.error("Error in App.tsx -> handleAddAdmin:", error);
        throw error; // Re-throw the error for the UI component to handle
    }
  };
    
  const handleDeleteUser = async (mobileNumber: string): Promise<void> => {
    try {
        await deleteUser(mobileNumber);
        setAllUsers(prevUsers => prevUsers.filter(user => user.mobileNumber !== mobileNumber));
    } catch (error) {
        console.error("Error in App.tsx -> handleDeleteUser:", error);
        throw error; // Re-throw the error for the UI component to handle
    }
  };

  const handleDeleteOwnAccount = async () => {
    if (user && window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
        try {
            await deleteUser(user.mobileNumber);
            handleLogout();
            alert("Your account has been successfully deleted.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            alert(`Error: ${message}`);
        }
    }
  };

  const renderPage = () => {
    if (isLoading || !contactInfo) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;

    switch (currentPage) {
      case Page.Home:
        return <HomePage onOrderNow={() => navigateTo(Page.Menu)} featuredItems={menuItems.slice(0, 4)} contactInfo={contactInfo} />;
      case Page.Menu:
        return <MenuPage menuItems={menuItems} isLoading={isLoading} />;
      case Page.Checkout:
        if (!user) {
          // The route guard will redirect, but show a spinner in the meantime.
          return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
        }
        return <CheckoutPage onOrderSuccess={() => {
            navigateTo(Page.OrderSuccess);
            fetchOrders().then(setOrders); // Re-fetch orders after a new one is placed
        }} user={user} />;
      case Page.OrderSuccess:
        return <OrderSuccessPage onBackToMenu={() => navigateTo(Page.Menu)} />;
      case Page.Admin:
        if (!isAdmin) {
          // The route guard will redirect, but show a spinner in the meantime.
          return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
        }
        return (
          <AdminDashboard 
            menuItems={menuItems}
            contactInfo={contactInfo}
            orders={orders}
            onUpdateContactInfo={handleUpdateContactInfo}
            onUpdateMenuItem={handleUpdateMenuItem}
            onAddMenuItem={handleAddMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            users={allUsers}
            isRootAdmin={isRootAdmin}
            onAddAdmin={handleAddAdmin}
            onDeleteUser={handleDeleteUser}
          />
        );
      default:
        return <HomePage onOrderNow={() => navigateTo(Page.Menu)} featuredItems={menuItems.slice(0, 4)} contactInfo={contactInfo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user} 
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        // FIX: Cannot find name 'onLogout'. Changed to use the defined handleLogout function.
        onLogout={handleLogout}
        onNavigate={navigateTo}
        isAdmin={isAdmin}
        onDeleteOwnAccount={handleDeleteOwnAccount}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      {contactInfo && <Footer contactInfo={contactInfo} onNavigate={navigateTo} />}
      {isCartOpen && <CartView onCheckout={() => navigateTo(Page.Checkout)} onBrowseMenu={() => navigateTo(Page.Menu)} />}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onAuthAttempt={handleAuthAttempt} />}
    </div>
  );
};

export default App;
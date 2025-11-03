
import { MenuItem, ContactInfo, User, UserRole, Order, OrderStatus, CartItem, UserCredentials } from '../types.ts';
import { MOCK_MENU_ITEMS, MOCK_CONTACT_INFO } from '../constants.tsx';

const ADMIN_PASSWORD = 'AdMin786@12';

// --- SIMULATED DATABASE with localStorage persistence ---
const initDB = () => {
  const menuItems = localStorage.getItem('homecook-menuItems');
  const contactInfo = localStorage.getItem('homecook-contactInfo');
  const orders = localStorage.getItem('homecook-orders');
  const users = localStorage.getItem('homecook-users');

  const defaultAdmin: UserCredentials = {
      mobileNumber: '9999999999',
      passwordHash: ADMIN_PASSWORD, 
      role: UserRole.RootAdmin,
  };
  
  return {
    menuItemsDB: menuItems ? JSON.parse(menuItems) : JSON.parse(JSON.stringify(MOCK_MENU_ITEMS)),
    contactInfoDB: contactInfo ? JSON.parse(contactInfo) : JSON.parse(JSON.stringify(MOCK_CONTACT_INFO)),
    ordersDB: orders ? JSON.parse(orders) : [],
    usersDB: users ? JSON.parse(users) : [defaultAdmin],
  };
};

let { menuItemsDB, contactInfoDB, ordersDB, usersDB } = initDB();

const saveMenuDB = () => localStorage.setItem('homecook-menuItems', JSON.stringify(menuItemsDB));
const saveContactInfoDB = () => localStorage.setItem('homecook-contactInfo', JSON.stringify(contactInfoDB));
const saveOrdersDB = () => localStorage.setItem('homecook-orders', JSON.stringify(ordersDB));
const saveUsersDB = () => localStorage.setItem('homecook-users', JSON.stringify(usersDB));


// --- HELPERS ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- USER AUTHENTICATION API ---
export const registerUser = async (mobileNumber: string, password: string): Promise<{user: User | null, error?: string}> => {
    await simulateDelay(400);
    if (usersDB.find((u: UserCredentials) => u.mobileNumber === mobileNumber)) {
        return { user: null, error: "An account with this mobile number already exists." };
    }
    const newUser: UserCredentials = {
        mobileNumber,
        passwordHash: password, // Plain text for simulation only
        role: UserRole.Customer
    };
    usersDB.push(newUser);
    saveUsersDB();
    const { passwordHash, ...user } = newUser;
    return { user };
};


export const loginUser = async (mobileNumber: string, password: string): Promise<{user: User | null, error?: string}> => {
    await simulateDelay(400);
    const foundUser = usersDB.find((u: UserCredentials) => u.mobileNumber === mobileNumber);

    if (!foundUser) {
        return { user: null, error: "No account found with this mobile number." };
    }

    // Simplified and correct password check for all user types.
    // For customers, it checks their unique password.
    // For admins, it checks against their assigned password.
    if (foundUser.passwordHash !== password) {
        return { user: null, error: "Incorrect password." };
    }

    const { passwordHash, ...user } = foundUser;
    return { user };
};

export const fetchAllUsers = async (): Promise<User[]> => {
    await simulateDelay(200);
    return usersDB.map(({ passwordHash, ...user }: UserCredentials) => user);
};

export const addAdminUser = async (mobileNumber: string, password: string): Promise<User[]> => {
    await simulateDelay(300);
    if (usersDB.find((u: UserCredentials) => u.mobileNumber === mobileNumber)) {
        throw new Error("An account with this mobile number already exists.");
    }
    const newAdmin: UserCredentials = {
        mobileNumber,
        passwordHash: password,
        role: UserRole.Admin
    };
    usersDB = [...usersDB, newAdmin];
    saveUsersDB();
    return usersDB.map(({ passwordHash, ...user }: UserCredentials) => user);
};

export const deleteUser = async (mobileNumberToDelete: string): Promise<{ success: boolean }> => {
    await simulateDelay(300);
    const userToDelete = usersDB.find((u: UserCredentials) => u.mobileNumber === mobileNumberToDelete);
    if (!userToDelete) {
        throw new Error("User not found.");
    }
    if (userToDelete.role === UserRole.RootAdmin) {
        throw new Error("The root admin account cannot be deleted.");
    }
    usersDB = usersDB.filter((u: UserCredentials) => u.mobileNumber !== mobileNumberToDelete);
    saveUsersDB();
    return { success: true };
};


// --- MENU API ---
export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  await simulateDelay(500);
  return JSON.parse(JSON.stringify(menuItemsDB));
};

export const updateMenuItem = async (updatedItem: MenuItem): Promise<MenuItem[]> => {
  await simulateDelay(300);
  menuItemsDB = menuItemsDB.map((item: MenuItem) => item.id === updatedItem.id ? updatedItem : item);
  saveMenuDB();
  return JSON.parse(JSON.stringify(menuItemsDB));
};

export const addMenuItem = async (newItemData: Omit<MenuItem, 'id'>): Promise<MenuItem[]> => {
  await simulateDelay(300);
  const newItem: MenuItem = {
    ...newItemData,
    id: menuItemsDB.length > 0 ? Math.max(...menuItemsDB.map((item: MenuItem) => item.id)) + 1 : 1,
  };
  menuItemsDB.push(newItem);
  saveMenuDB();
  return JSON.parse(JSON.stringify(menuItemsDB));
};

export const deleteMenuItem = async (itemId: number): Promise<{ success: boolean }> => {
    await simulateDelay(300);
    const initialLength = menuItemsDB.length;
    menuItemsDB = menuItemsDB.filter((item: MenuItem) => item.id !== itemId);
    if (menuItemsDB.length === initialLength) {
        throw new Error("Menu item not found to delete.");
    }
    saveMenuDB();
    return { success: true };
};

// --- CONTACT INFO API ---
export const updateContactInfo = async (newInfo?: ContactInfo): Promise<ContactInfo> => {
  await simulateDelay(300);
  if (newInfo) {
    contactInfoDB = { ...newInfo };
    saveContactInfoDB();
  }
  return JSON.parse(JSON.stringify(contactInfoDB));
};

// --- ORDER API ---
export const fetchOrders = async (): Promise<Order[]> => {
    await simulateDelay(500);
    return JSON.parse(JSON.stringify(ordersDB)).sort((a: Order, b: Order) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const placeOrder = async (cartItems: CartItem[], user: User, paymentMethod: string, totalAmount: number): Promise<{ success: boolean; orderId: string }> => {
  await simulateDelay(1000);
  
  const newOrder: Order = {
    id: `HC-${Date.now()}`,
    user,
    items: cartItems,
    totalAmount,
    paymentMethod,
    status: OrderStatus.Placed,
    timestamp: new Date().toISOString(),
  };
  
  ordersDB.push(newOrder);
  saveOrdersDB();

  console.log('Placing order:', newOrder);
  
  if (user.mobileNumber) {
      console.log(`Simulating SMS to ${user.mobileNumber}: Your order ${newOrder.id} is confirmed!`);
      // In a real app, this alert would be replaced by a toast notification.
      alert(`Order Confirmed!\nA confirmation SMS has been sent to ${user.mobileNumber}.`);
  }
  return { success: true, orderId: newOrder.id };
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order[]> => {
    await simulateDelay(300);
    ordersDB = ordersDB.map((order: Order) => order.id === orderId ? { ...order, status } : order);
    saveOrdersDB();
    return JSON.parse(JSON.stringify(ordersDB)).sort((a: Order, b: Order) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
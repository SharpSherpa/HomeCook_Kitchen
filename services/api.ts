
import { MenuItem, ContactInfo, User, UserRole, UserCredentials, CartItem } from '../types';
import { MOCK_CONTACT_INFO } from '../constants';

const ADMIN_MOBILE = '9999999999';
const ADMIN_PASSWORD = 'AdMin786@12';
const ADMIN_USERNAME = 'Owner';

// --- SIMULATED DATABASE with localStorage persistence ---

const initDB = () => {
  const menuItems = localStorage.getItem('homecook-menuItems');
  const contactInfo = localStorage.getItem('homecook-contactInfo');
  const users = localStorage.getItem('homecook-users');

  const rootAdmin: UserCredentials = {
      username: ADMIN_USERNAME,
      mobileNumber: ADMIN_MOBILE,
      passwordHash: ADMIN_PASSWORD, 
      role: UserRole.RootAdmin,
  };
  
  return {
    menuItemsDB: menuItems ? JSON.parse(menuItems) : [],
    contactInfoDB: contactInfo ? JSON.parse(contactInfo) : JSON.parse(JSON.stringify(MOCK_CONTACT_INFO)),
    // Users DB is now for the admin. No need to persist this, as it's hardcoded.
    usersDB: [rootAdmin], 
  };
};

// Use a single object as the source of truth for the database.
const DB = initDB();

const saveMenuDB = () => localStorage.setItem('homecook-menuItems', JSON.stringify(DB.menuItemsDB));
const saveContactInfoDB = () => localStorage.setItem('homecook-contactInfo', JSON.stringify(DB.contactInfoDB));

// --- HELPERS ---

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- USER AUTHENTICATION API (ADMIN ONLY) ---

export const loginUser = async (username: string, password: string): Promise<{user: User | null, error?: string}> => {
    await simulateDelay(400);

    const adminUser = DB.usersDB.find((u: UserCredentials) => u.username === ADMIN_USERNAME);
    
    // Check if admin user exists, and if username and password match.
    // If any part of the check fails, return the generic error message.
    if (!adminUser || username !== ADMIN_USERNAME || adminUser.passwordHash !== password) {
        return { user: null, error: "Either of Username or Password is wrong." };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...user } = adminUser;
    return { user };
};


// --- MENU API ---

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  await simulateDelay(500);
  return JSON.parse(JSON.stringify(DB.menuItemsDB));
};

export const updateMenuItem = async (updatedItem: MenuItem): Promise<MenuItem[]> => {
  await simulateDelay(300);
  const index = DB.menuItemsDB.findIndex((item: MenuItem) => item.id === updatedItem.id);
  if (index !== -1) {
    DB.menuItemsDB[index] = updatedItem;
    saveMenuDB();
  }
  return JSON.parse(JSON.stringify(DB.menuItemsDB));
};

export const addMenuItem = async (newItemData: Omit<MenuItem, 'id'>): Promise<MenuItem[]> => {
  await simulateDelay(300);
  const newItem: MenuItem = {
    ...newItemData,
    id: DB.menuItemsDB.length > 0 ? Math.max(...DB.menuItemsDB.map((item: MenuItem) => item.id)) + 1 : 1,
  };
  DB.menuItemsDB.push(newItem);
  saveMenuDB();
  return JSON.parse(JSON.stringify(DB.menuItemsDB));
};

// FIX: Added placeOrder function to simulate order placement for the checkout page.
export const placeOrder = async (
  items: CartItem[],
  user: User,
  paymentMethod: 'COD' | 'Online',
  total: number
): Promise<{ success: boolean; orderId?: string }> => {
  await simulateDelay(1000); // Simulate network latency
  console.log('Order placed:', {
    user: user.username,
    items: items.map(i => `${i.item.name} x${i.quantity}`),
    total,
    paymentMethod,
  });
  // In a real app, this would save to a database and return a real order ID.
  return { success: true, orderId: `HC-${Date.now()}` };
};

export const deleteMenuItem = async (itemId: number): Promise<MenuItem[]> => {
    await simulateDelay(300);
    const index = DB.menuItemsDB.findIndex((item: MenuItem) => item.id === itemId);
    if (index !== -1) {
        DB.menuItemsDB.splice(index, 1);
        saveMenuDB();
    }
    return JSON.parse(JSON.stringify(DB.menuItemsDB));
};

// --- CONTACT INFO API ---

export const updateContactInfo = async (newInfo?: ContactInfo): Promise<ContactInfo> => {
    await simulateDelay(200);
    if (newInfo) {
      DB.contactInfoDB = { ...newInfo };
      saveContactInfoDB();
    }
    return JSON.parse(JSON.stringify(DB.contactInfoDB));
};
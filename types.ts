
export enum MenuItemStatus {
  Available = 'available',
  Unavailable = 'unavailable',
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  status: MenuItemStatus;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
  upiId: string;
}

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
  RootAdmin = 'root_admin',
}

export interface User {
  username: string;
  mobileNumber: string;
  role: UserRole;
}

// FIX: Added CartItem interface to be used in the shopping cart.
export interface CartItem {
    item: MenuItem;
    quantity: number;
}

// For backend simulation, not exposed to frontend state
export interface UserCredentials extends User {
    passwordHash: string; // In a real app, this would be a salted hash
}

export enum Page {
  Home,
  Menu,
  Pay,
  Admin,
}
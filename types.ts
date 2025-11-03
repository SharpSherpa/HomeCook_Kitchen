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

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
}

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
  RootAdmin = 'root_admin',
}

export interface User {
  mobileNumber: string;
  role: UserRole;
}

// For backend simulation, not exposed to frontend state
export interface UserCredentials extends User {
    passwordHash: string; // In a real app, this would be a salted hash
}

export enum OrderStatus {
    Placed = 'Placed',
    Preparing = 'Preparing',
    OutForDelivery = 'Out for Delivery',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled',
}

export interface Order {
    id: string;
    user: User;
    items: CartItem[];
    totalAmount: number;
    paymentMethod: string;
    status: OrderStatus;
    timestamp: string;
}


export enum Page {
  Home,
  Menu,
  Checkout,
  OrderSuccess,
  Admin,
}
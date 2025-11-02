import { MenuItem, ContactInfo, MenuItemStatus } from './types';

export const RESTAURANT_NAME = "HomeCook";

export const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Spicy Chicken Biryani", description: "Aromatic basmati rice cooked with tender chicken pieces, saffron, and a blend of exotic spices. Served with raita.", price: 250, imageUrl: "https://picsum.photos/id/10/400/300", category: "Main Course", status: MenuItemStatus.Available },
  { id: 2, name: "Paneer Butter Masala", description: "Soft cubes of paneer cooked in a rich, creamy tomato and cashew gravy. A vegetarian's delight.", price: 220, imageUrl: "https://picsum.photos/id/20/400/300", category: "Main Course", status: MenuItemStatus.Available },
  { id: 3, name: "Garlic Naan", description: "A soft, leavened flatbread, freshly baked in a tandoor and brushed with garlic-infused butter.", price: 40, imageUrl: "https://picsum.photos/id/30/400/300", category: "Breads", status: MenuItemStatus.Available },
  { id: 4, name: "Chocolate Lava Cake", description: "A decadent warm chocolate cake with a gooey, molten chocolate center. Served with a scoop of vanilla ice cream.", price: 150, imageUrl: "https://picsum.photos/id/40/400/300", category: "Desserts", status: MenuItemStatus.Unavailable },
  { id: 5, name: "Mutton Rogan Josh", description: "A fiery and aromatic mutton curry from the valleys of Kashmir, slow-cooked with a blend of traditional spices.", price: 350, imageUrl: "https://picsum.photos/id/50/400/300", category: "Main Course", status: MenuItemStatus.Available },
  { id: 6, name: "Veg Hakka Noodles", description: "Classic stir-fried noodles tossed with a colorful mix of fresh vegetables and a savory soy-based sauce.", price: 180, imageUrl: "https://picsum.photos/id/60/400/300", category: "Chinese", status: MenuItemStatus.Available },
  { id: 7, name: "Gulab Jamun", description: "Sweet, soft dough balls made from milk solids, fried to a golden brown and soaked in a fragrant sugar syrup.", price: 80, imageUrl: "https://picsum.photos/id/70/400/300", category: "Desserts", status: MenuItemStatus.Available },
  { id: 8, name: "Tandoori Chicken", description: "Juicy chicken marinated in a mixture of yogurt and aromatic spices, then roasted to perfection in a traditional tandoor.", price: 280, imageUrl: "https://picsum.photos/id/80/400/300", category: "Starters", status: MenuItemStatus.Available },
];

export const MOCK_CONTACT_INFO: ContactInfo = {
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "orders@homecook.com",
  address: "123, Foodie Lane, Kolkata, India",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.186438029059!2d88.3638953154181!3d22.57264608518349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02760c0f5f5f5b%3A0x3f3b6d3b5d6f6f6d!2sVictoria%20Memorial!5e0!3m2!1sen!2sin!4v1678886453123!5m2!1sen!2sin"
};

export const UPI_QR_CODE_URL = "https://picsum.photos/seed/qr/300/300";

export const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const IconMinus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

export const IconClose = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const IconMenu = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
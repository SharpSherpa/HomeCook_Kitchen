import { MenuItem, ContactInfo, MenuItemStatus } from './types';

export const RESTAURANT_NAME = "HomeCook";

export const MOCK_CONTACT_INFO: ContactInfo = {
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "orders@homecook.com",
  address: "123, Foodie Lane, Kolkata, India",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.186438029059!2d88.3638953154181!3d22.57264608518349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02760c0f5f5f5b%3A0x3f3b6d3b5d6f6f6d!2sVictoria%20Memorial!5e0!3m2!1sen!2sin!4v1678886453123!5m2!1sen!2sin",
  upiId: ""
};

export const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

// FIX: Added missing IconPlus for quantity control.
export const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
    </svg>
);

// FIX: Added missing IconMinus for quantity control.
export const IconMinus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
    </svg>
);
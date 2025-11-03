
import React from 'react';
import { ContactInfo, Page } from '../types.ts';
import { RESTAURANT_NAME } from '../constants.tsx';

interface FooterProps {
  contactInfo: ContactInfo;
  onNavigate: (page: Page, sectionId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ contactInfo, onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: Page, sectionId?: string) => {
    e.preventDefault();
    onNavigate(page, sectionId);
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">{RESTAURANT_NAME}</h3>
            <p className="text-gray-400">Bringing the taste of authentic home-cooked meals right to your doorstep.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Phone: {contactInfo.phone}</li>
              <li>WhatsApp: {contactInfo.whatsapp}</li>
              <li>Email: {contactInfo.email}</li>
              <li>Address: {contactInfo.address}</li>
            </ul>
          </div>
          <div>
             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
                <li><a href="#" onClick={(e) => handleNavClick(e, Page.Menu)} className="hover:text-orange-500 transition-colors">Menu</a></li>
                <li><a href="#" onClick={(e) => handleNavClick(e, Page.Home, 'about-us')} className="hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" onClick={(e) => handleNavClick(e, Page.Home, 'contact')} className="hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {RESTAURANT_NAME}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
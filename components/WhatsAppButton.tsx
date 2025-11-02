import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber }) => {
  if (!phoneNumber) return null;
  
  // Remove any non-digit characters from the phone number
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;

  return (
    <div className="absolute top-0 right-0 h-full w-28 pointer-events-none z-30">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky w-16 h-16 ml-auto mr-6 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg transform-gpu pointer-events-auto"
          aria-label="Chat on WhatsApp"
          style={{ top: '50vh' }}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
            alt="Chat on WhatsApp"
            className="w-full h-full object-cover rounded-full"
          />
        </a>
    </div>
  );
};

export default WhatsAppButton;

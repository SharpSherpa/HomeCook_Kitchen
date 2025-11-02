import React from 'react';
import { RESTAURANT_NAME } from '../../constants';
import { ContactInfo } from '../../types';

interface PayPageProps {
  contactInfo: ContactInfo;
}

const PayPage: React.FC<PayPageProps> = ({ contactInfo }) => {
  const hasUpiId = contactInfo && contactInfo.upiId && contactInfo.upiId.trim().length > 0;
  const upiUrl = hasUpiId ? `upi://pay?pa=${contactInfo.upiId}&pn=${RESTAURANT_NAME}` : '';
  const qrCodeUrl = hasUpiId ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}` : '';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Pay with UPI</h1>
        
        {hasUpiId ? (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Scan the QR code below with any UPI-enabled app to complete your payment.
            </p>
            <div className="flex justify-center mb-6">
              <img src={qrCodeUrl} alt="UPI QR Code" className="w-64 h-64 rounded-lg shadow-inner bg-white p-2" />
            </div>
            <div className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Instructions</h2>
              <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>Open your favorite UPI app (Google Pay, PhonePe, Paytm, etc.).</li>
                <li>Select the 'Scan & Pay' option.</li>
                <li>Point your camera at the QR code above.</li>
                <li>Enter the total amount for your order.</li>
                <li>Confirm the payment. Please share a screenshot on WhatsApp for confirmation.</li>
              </ol>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Online payments are currently unavailable.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              The admin has not configured UPI payment details yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayPage;
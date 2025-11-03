
import React from 'react';
import Button from '../Button.tsx';

interface OrderSuccessPageProps {
    onBackToMenu: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onBackToMenu }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-xl inline-block animate-zoom-in">
        <svg className="w-24 h-24 text-green-500 mx-auto mb-6 transform transition-transform duration-500 scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(1.2)', transition: 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0.2s' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Thank you for your order. You can track the status below. An SMS confirmation has been sent.</p>
        
        {/* Mock Order Tracker */}
        <div className="w-full max-w-md mx-auto my-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Order Status</h3>
            <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="text-orange-500 font-bold">Placed</span>
                <span>Preparing</span>
                <span>Out for Delivery</span>
                <span>Delivered</span>
            </div>
            <div className="relative mt-2">
                <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="absolute top-0 left-0 h-1 bg-orange-600 rounded-full" style={{ width: '15%' }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-600 rounded-full shadow" style={{ left: '15%' }}></div>
            </div>
        </div>

        <Button onClick={onBackToMenu} className="mt-6">
          Order More Food
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
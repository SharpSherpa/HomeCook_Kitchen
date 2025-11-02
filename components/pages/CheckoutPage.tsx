import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import Button from '../Button';
import { placeOrder } from '../../services/api';
import { UPI_QR_CODE_URL } from '../../constants';
import Spinner from '../Spinner';
import { User } from '../../types';

interface CheckoutPageProps {
  onOrderSuccess: () => void;
  user: User;
}

type PaymentMethod = 'COD' | 'Online';

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, user }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Online');

  const taxesAndCharges = totalPrice * 0.1; // 10% mock tax
  const discount = 0; // Mock discount
  const grandTotal = totalPrice + taxesAndCharges - discount;

  const handleConfirmOrder = async () => {
    setIsPlacingOrder(true);
    const result = await placeOrder(cartItems, user, paymentMethod, grandTotal);
    if (result.success) {
      clearCart();
      onOrderSuccess();
    } else {
      alert("There was an issue placing your order. Please try again.");
    }
    setIsPlacingOrder(false);
  };

  if (cartItems.length === 0) {
      return (
          <div className="container mx-auto text-center py-20 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your cart is empty.</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Please add items to your cart before proceeding to checkout.</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Order Summary */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Order Summary</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {cartItems.map(({ item, quantity }) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{quantity} x ₹{item.price.toFixed(2)}</p>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">₹{(item.price * quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 text-gray-800 dark:text-gray-200">
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Taxes & Charges (10%)</span><span>₹{taxesAndCharges.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-500"><span>Discount</span><span>- ₹{discount.toFixed(2)}</span></div>
            <div className="flex justify-between text-xl font-bold mt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-4"><span >Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Choose Payment Method</h2>
          <div className="flex space-x-4 mb-6">
              <label className={`flex-1 p-4 border rounded-lg text-center cursor-pointer ${paymentMethod === 'Online' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/50' : 'border-gray-300 dark:border-gray-600'} text-gray-800 dark:text-gray-200`}>
                  <input type="radio" name="paymentMethod" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="sr-only"/>
                  Online Payment
              </label>
              <label className={`flex-1 p-4 border rounded-lg text-center cursor-pointer ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/50' : 'border-gray-300 dark:border-gray-600'} text-gray-800 dark:text-gray-200`}>
                  <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="sr-only"/>
                  Cash on Delivery
              </label>
          </div>
          
          {paymentMethod === 'Online' && (
              <div className="flex flex-col items-center animate-fade-in">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Scan to Pay</h3>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">Use any UPI app to pay ₹{grandTotal.toFixed(2)}</p>
                <img src={UPI_QR_CODE_URL} alt="UPI QR Code" className="w-64 h-64 rounded-lg shadow-inner bg-white" />
              </div>
          )}

          {paymentMethod === 'COD' && (
              <div className="text-center p-8 bg-gray-100 dark:bg-gray-700 rounded-lg animate-fade-in">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ready to Order?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">You've selected Cash on Delivery. Please have the exact amount of ₹{grandTotal.toFixed(2)} ready.</p>
              </div>
          )}

          <div className="mt-auto pt-8 w-full">
            <Button onClick={handleConfirmOrder} className="w-full text-lg" disabled={isPlacingOrder}>
              {isPlacingOrder ? <Spinner/> : (paymentMethod === 'COD' ? 'Place Order' : 'Confirm Payment & Order')}
            </Button>
            {paymentMethod === 'Online' && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">After payment, click the button above.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import Button from '../Button';
import { placeOrder } from '../../services/api';
import { RESTAURANT_NAME } from '../../constants';
import Spinner from '../Spinner';
import { User, ContactInfo } from '../../types';

interface CheckoutPageProps {
  onOrderSuccess: () => void;
  user: User;
  contactInfo: ContactInfo;
}

type PaymentMethod = 'COD' | 'Online';

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, user, contactInfo }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // FIX: Changed hasUpiNumber to hasUpiId and checked for contactInfo.upiId.
  const hasUpiId = contactInfo && contactInfo.upiId && contactInfo.upiId.length > 0;
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(hasUpiId ? 'Online' : 'COD');

  useEffect(() => {
    // If UPI becomes unavailable, switch to COD
    // FIX: Changed dependency to hasUpiId.
    if (!hasUpiId) {
        setPaymentMethod('COD');
    }
  }, [hasUpiId]);

  const taxesAndCharges = totalPrice * 0.1; // 10% mock tax
  const discount = 0; // Mock discount
  const grandTotal = totalPrice + taxesAndCharges - discount;

  // FIX: Changed upiMobileNumber to upiId and constructed the correct UPI URL.
  const upiUrl = hasUpiId ? `upi://pay?pa=${contactInfo.upiId}&pn=${RESTAURANT_NAME}&am=${grandTotal.toFixed(2)}&cu=INR` : '';
  const qrCodeUrl = hasUpiId ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}` : '';

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
                  <p className="text-sm text-gray-500 dark:text-gray-400">{quantity} x ₹ {item.price.toFixed(2)}</p>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">₹ {(item.price * quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 text-gray-800 dark:text-gray-200">
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span>₹ {totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Taxes & Charges (10%)</span><span>₹ {taxesAndCharges.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-500"><span>Discount</span><span>- ₹ {discount.toFixed(2)}</span></div>
            <div className="flex justify-between text-xl font-bold mt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-4"><span >Grand Total</span><span>₹ {grandTotal.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Choose Payment Method</h2>
          <div className="flex space-x-4 mb-6">
              {/* FIX: Changed hasUpiNumber checks to hasUpiId. */}
              <label className={`flex-1 p-4 border rounded-lg text-center cursor-pointer ${paymentMethod === 'Online' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/50' : 'border-gray-300 dark:border-gray-600'} ${!hasUpiId ? 'opacity-50 cursor-not-allowed' : ''} text-gray-800 dark:text-gray-200`}>
                  <input type="radio" name="paymentMethod" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="sr-only" disabled={!hasUpiId}/>
                  Online Payment
                  {!hasUpiId && <span className="text-xs block">(Unavailable)</span>}
              </label>
              <label className={`flex-1 p-4 border rounded-lg text-center cursor-pointer ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/50' : 'border-gray-300 dark:border-gray-600'} text-gray-800 dark:text-gray-200`}>
                  <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="sr-only"/>
                  Cash on Delivery
              </label>
          </div>
          
          {/* FIX: Changed hasUpiNumber checks to hasUpiId. */}
          {paymentMethod === 'Online' && hasUpiId && (
              <div className="flex flex-col items-center animate-fade-in">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Scan to Pay</h3>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">Use any UPI app to pay ₹ {grandTotal.toFixed(2)}</p>
                <img src={qrCodeUrl} alt="UPI QR Code" className="w-64 h-64 rounded-lg shadow-inner bg-white p-2" />
              </div>
          )}

          {paymentMethod === 'COD' && (
              <div className="text-center p-8 bg-gray-100 dark:bg-gray-700 rounded-lg animate-fade-in">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ready to Order?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">You've selected Cash on Delivery. Please have the exact amount of ₹ {grandTotal.toFixed(2)} ready.</p>
              </div>
          )}

          <div className="mt-auto pt-8 w-full">
            <Button onClick={handleConfirmOrder} className="w-full text-lg" disabled={isPlacingOrder}>
              {isPlacingOrder ? <Spinner/> : (paymentMethod === 'COD' ? 'Place Order' : 'Confirm Payment & Order')}
            </Button>
            {/* FIX: Changed hasUpiNumber checks to hasUpiId. */}
            {paymentMethod === 'Online' && hasUpiId && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">After payment, click the button above.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import React, { useState, useEffect } from 'react';
import { MenuItem, ContactInfo, MenuItemStatus } from '../../types';
import Button from '../Button';
import { suggestDish } from '../../services/geminiService';
import Spinner from '../Spinner';
import { RESTAURANT_NAME } from '../../constants';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  contactInfo: ContactInfo;
  onUpdateContactInfo: (info: ContactInfo) => Promise<void>;
  onUpdateMenuItem: (item: MenuItem) => Promise<void>;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ menuItems, contactInfo, onUpdateContactInfo, onUpdateMenuItem, onAddMenuItem }) => {
  const [editableContactInfo, setEditableContactInfo] = useState(contactInfo);
  const [isEditingItem, setIsEditingItem] = useState<MenuItem | null>(null);
  
  const [ingredients, setIngredients] = useState('');
  const [suggestion, setSuggestion] = useState<{ dishName: string; description: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setEditableContactInfo(contactInfo);
  }, [contactInfo]);

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditableContactInfo({ ...editableContactInfo, [e.target.name]: e.target.value });
  };
  
  const handleSaveContactInfo = async () => {
      await onUpdateContactInfo(editableContactInfo);
      alert('Contact info updated!');
  };
  
  const handleAddNewItem = () => {
    const newItem: MenuItem = {
        id: -1, // Temporary ID
        name: "New Dish Name",
        description: "New dish description.",
        price: 100,
        imageUrl: "https://picsum.photos/400/300",
        category: "Main Course",
        status: MenuItemStatus.Available
    };
    setIsEditingItem(newItem);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNewOrEditItem = async () => {
    if (isEditingItem) {
        if (isEditingItem.name.trim() === '' || isEditingItem.description.trim() === '' || isEditingItem.category.trim() === '' || isEditingItem.price <= 0) {
            alert("Please fill out all fields with valid values.");
            return;
        }
        if (isEditingItem.id === -1) { // Adding new item
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...newItemData } = isEditingItem;
            await onAddMenuItem(newItemData);
            setIsEditingItem(null);
            alert('New item added!');
        } else { // Editing existing item
            await onUpdateMenuItem(isEditingItem);
            setIsEditingItem(null);
            alert(`Item "${isEditingItem.name}" updated!`);
        }
    }
  };

  const handleGenerateSuggestion = async () => {
    if (!ingredients.trim()) {
        alert("Please enter some ingredients.");
        return;
    }
    setIsGenerating(true);
    setSuggestion(null);
    const result = await suggestDish(ingredients);
    setSuggestion(result);
    setIsGenerating(false);
  };

  const useSuggestion = () => {
    if (suggestion && isEditingItem) {
        setIsEditingItem({ ...isEditingItem, name: suggestion.dishName, description: suggestion.description });
        setSuggestion(null);
    }
  };
  
  const isValidUpiId = editableContactInfo.upiId && editableContactInfo.upiId.includes('@');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {isEditingItem && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8 animate-fade-in">
              <h3 className="font-semibold text-lg mb-4">{isEditingItem.id === -1 ? 'Add New Item' : `Editing: ${isEditingItem.name}`}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={isEditingItem.name} onChange={(e) => setIsEditingItem({...isEditingItem, name: e.target.value})} placeholder="Name" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700"/>
                  <input type="number" value={isEditingItem.price} onChange={(e) => setIsEditingItem({...isEditingItem, price: Number(e.target.value)})} placeholder="Price" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700"/>
                  <input value={isEditingItem.category} onChange={(e) => setIsEditingItem({...isEditingItem, category: e.target.value})} placeholder="Category" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700"/>
                  <input value={isEditingItem.imageUrl} onChange={(e) => setIsEditingItem({...isEditingItem, imageUrl: e.target.value})} placeholder="Image URL" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700"/>
                  <textarea value={isEditingItem.description} onChange={(e) => setIsEditingItem({...isEditingItem, description: e.target.value})} placeholder="Description" className="md:col-span-2 p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700"/>
              </div>
              <div className="mt-4 flex gap-4">
                  <Button onClick={handleSaveNewOrEditItem}>Save Changes</Button>
                  <Button onClick={() => setIsEditingItem(null)} variant="secondary">Cancel</Button>
              </div>
          </div>
      )}
      
      {/* Contact Info Management */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="phone" value={editableContactInfo.phone} onChange={handleContactInfoChange} placeholder="Phone" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700" />
          <input name="whatsapp" value={editableContactInfo.whatsapp} onChange={handleContactInfoChange} placeholder="WhatsApp" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700" />
          <input name="email" value={editableContactInfo.email} onChange={handleContactInfoChange} placeholder="Email" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700" />
          <input name="address" value={editableContactInfo.address} onChange={handleContactInfoChange} placeholder="Address" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700" />
          <input name="upiId" value={editableContactInfo.upiId} onChange={handleContactInfoChange} placeholder="UPI ID (e.g. yourname@bank)" className="p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700" />
          <textarea name="mapEmbedUrl" value={editableContactInfo.mapEmbedUrl} onChange={handleContactInfoChange} placeholder="Google Maps Embed URL" className="p-2 border rounded h-24 bg-transparent border-gray-300 dark:border-gray-700" />
        </div>
        <Button onClick={handleSaveContactInfo} className="mt-4">Save Contact Info</Button>

        {isValidUpiId && (
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">UPI QR Code Preview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This QR code will be shown to customers for payment.</p>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${editableContactInfo.upiId}&pn=${RESTAURANT_NAME}`}
              alt="UPI QR Code Preview"
              className="w-40 h-40 rounded-lg bg-white p-2 shadow-md"
            />
          </div>
        )}
      </div>

      {/* Gemini Dish Suggester */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">✨ Chef's AI Assistant</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Enter available ingredients to get a creative dish suggestion from Gemini AI.</p>
        <div className="flex items-center gap-4">
            <input 
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken, cream, spinach, garlic" 
                className="flex-grow p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700"
            />
            <Button onClick={handleGenerateSuggestion} disabled={isGenerating}>
                {isGenerating ? "Thinking..." : "Suggest Dish"}
            </Button>
        </div>
        {isGenerating && <Spinner />}
        {suggestion && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/50 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h3 className="font-bold text-lg">{suggestion.dishName}</h3>
                <p>{suggestion.description}</p>
                {isEditingItem && isEditingItem.id === -1 && <Button onClick={useSuggestion} className="mt-2 text-sm px-3 py-1">Use this Suggestion</Button>}
            </div>
        )}
      </div>

      {/* Menu Management */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Menu Management</h2>
          <Button onClick={handleAddNewItem}>Add New Item</Button>
        </div>
        <div className="space-y-2 overflow-x-auto">
          {menuItems.map(item => (
            <div key={item.id} className="grid grid-cols-5 gap-4 items-center p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="col-span-2 font-medium">{item.name}</div>
              <div>₹ {item.price.toFixed(2)}</div>
              <div>
                <select 
                    value={item.status} 
                    onChange={e => onUpdateMenuItem({...item, status: e.target.value as MenuItemStatus})}
                    className={`p-1 rounded text-sm bg-transparent border border-gray-300 dark:border-gray-600 focus:ring-orange-500 ${item.status === MenuItemStatus.Available ? 'text-green-500' : 'text-red-500'}`}
                >
                    <option value={MenuItemStatus.Available}>Available</option>
                    <option value={MenuItemStatus.Unavailable}>Unavailable</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button onClick={() => { setIsEditingItem(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }} variant="secondary" className="text-sm px-3 py-1">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
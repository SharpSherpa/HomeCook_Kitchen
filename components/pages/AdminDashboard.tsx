
import React, { useState, useEffect } from 'react';
import { MenuItem, ContactInfo, MenuItemStatus, Order, OrderStatus, User, UserRole } from '../../types.ts';
import Button from '../Button.tsx';
import { suggestDish } from '../../services/geminiService.ts';
import Spinner from '../Spinner.tsx';
import { IconTrash } from '../../constants.tsx';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  contactInfo: ContactInfo;
  orders: Order[];
  onUpdateContactInfo: (info: ContactInfo) => Promise<void>;
  onUpdateMenuItem: (item: MenuItem) => Promise<void>;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  onDeleteMenuItem: (id: number) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  users: User[];
  isRootAdmin: boolean;
  onAddAdmin: (mobileNumber: string, password: string) => Promise<void>;
  onDeleteUser: (mobileNumber: string) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ menuItems, contactInfo, orders, onUpdateContactInfo, onUpdateMenuItem, onAddMenuItem, onDeleteMenuItem, onUpdateOrderStatus, users, isRootAdmin, onAddAdmin, onDeleteUser }) => {
  const [editableContactInfo, setEditableContactInfo] = useState(contactInfo);
  const [isEditingItem, setIsEditingItem] = useState<MenuItem | null>(null);
  
  const [ingredients, setIngredients] = useState('');
  const [suggestion, setSuggestion] = useState<{ dishName: string; description: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [newAdminNumber, setNewAdminNumber] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

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
        if (isEditingItem.id === -1) { // Adding new item
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

  const handleDeleteItem = async (item: MenuItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await onDeleteMenuItem(item.id);
        // Success is confirmed by the item disappearing from the list. No alert needed.
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        alert(`Error: Could not delete item. ${message}`);
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
  
  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Strict frontend validation as requested.
    if (newAdminNumber.length !== 10) {
        alert('Mobile number must be 10 characters long.');
        return;
    }
    if (newAdminPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    try {
        await onAddAdmin(newAdminNumber, newAdminPassword);
        setNewAdminNumber('');
        setNewAdminPassword('');
        alert('New admin user created successfully.');
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        alert(`Error: ${message}`);
    }
  };

  const handleDeleteUserClick = async (userToDelete: User) => {
    if (window.confirm(`Are you sure you want to delete the user with mobile number ${userToDelete.mobileNumber}?`)) {
      try {
        await onDeleteUser(userToDelete.mobileNumber);
        // Success is confirmed by the user disappearing from the list. No alert needed.
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        alert(`Error: Could not delete user. ${message}`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {isEditingItem && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
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
      
      {/* User Management */}
      {isRootAdmin && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">User Management</h2>
              
              <div className="mb-6 border-b dark:border-gray-700 pb-6">
                  <h3 className="text-lg font-medium mb-2">Create New Admin User</h3>
                  <form onSubmit={handleAddAdminSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                        <input 
                            type="text"
                            value={newAdminNumber}
                            onChange={(e) => setNewAdminNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                            className="flex-grow p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700 w-full sm:w-auto"
                        />
                        <input 
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            placeholder="Enter temporary password"
                            className="flex-grow p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700 w-full sm:w-auto"
                        />
                        <Button type="submit" className="w-full sm:w-auto">Create Admin</Button>
                  </form>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">The new admin user will log in with the mobile number and password you provide.</p>
              </div>

              <h3 className="text-lg font-medium mb-2">All Users</h3>
                <div className="space-y-2 overflow-x-auto">
                  {users.map(user => (
                    <div key={user.mobileNumber} className="grid grid-cols-4 gap-4 items-center p-3 border-b dark:border-gray-700">
                      <div className="col-span-2 font-medium">{user.mobileNumber}</div>
                      <div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === UserRole.RootAdmin ? 'bg-yellow-200 text-yellow-800' :
                            user.role === UserRole.Admin ? 'bg-blue-200 text-blue-800' :
                            'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                            {user.role === UserRole.RootAdmin ? 'Root Admin' : user.role === UserRole.Admin ? 'Admin' : 'Customer'}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        {user.role !== UserRole.RootAdmin && (
                            <Button onClick={() => handleDeleteUserClick(user)} variant="danger" className="text-sm px-3 py-1">
                                <IconTrash/>
                            </Button>
                        )}
                      </div>
                    </div>
                  ))}
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
          <textarea name="mapEmbedUrl" value={editableContactInfo.mapEmbedUrl} onChange={handleContactInfoChange} placeholder="Google Maps Embed URL" className="p-2 border rounded md:col-span-2 h-24 bg-transparent border-gray-300 dark:border-gray-700" />
        </div>
        <Button onClick={handleSaveContactInfo} className="mt-4">Save Contact Info</Button>
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
              <div>₹{item.price.toFixed(2)}</div>
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
                <Button onClick={() => handleDeleteItem(item)} variant="danger" className="text-sm px-3 py-1"><IconTrash/></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 dark:border-gray-700">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Date</th>
                <th className="p-2">Items</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-2 font-mono text-sm">{order.id}</td>
                  <td className="p-2">{order.user.mobileNumber}</td>
                  <td className="p-2 text-sm">{new Date(order.timestamp).toLocaleString()}</td>
                  <td className="p-2 text-sm">
                    {order.items.map(ci => `${ci.quantity}x ${ci.item.name}`).join(', ')}
                  </td>
                  <td className="p-2 font-semibold">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="p-2">
                    <select 
                      value={order.status} 
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="p-1 rounded text-sm bg-transparent border border-gray-300 dark:border-gray-600 focus:ring-orange-500"
                    >
                      {Object.values(OrderStatus).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center p-4 text-gray-500 dark:text-gray-400">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
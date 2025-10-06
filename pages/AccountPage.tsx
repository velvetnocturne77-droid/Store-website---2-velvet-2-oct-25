import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Order, ShippingAddress } from '../types';

const InputField = ({id, label, ...props}: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input id={id} className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded" {...props} />
  </div>
);

const AccountPage: React.FC = () => {
  const { currentUser, logout, orders, updateUserAddress } = useStore();
  const navigate = useNavigate();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>(
    currentUser?.shippingAddress || { name: '', phone: '', address: '', city: '', zip: '', country: '' }
  );

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserAddress(address);
    setIsEditingAddress(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-900/50';
      case 'Partially Paid': return 'text-orange-400 bg-orange-900/50';
      case 'Processing': return 'text-blue-400 bg-blue-900/50';
      case 'Shipped': return 'text-green-400 bg-green-900/50';
      case 'Delivered': return 'text-gray-400 bg-gray-700/50';
      default: return 'text-gray-400';
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 fade-in">
      <h1 className="text-4xl font-serif text-center mb-12">My Account</h1>

      <div className="max-w-4xl mx-auto bg-brand-dark p-8 border border-gray-800 rounded-lg">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-serif text-brand-gold">Welcome,</h2>
            <p className="text-lg">{currentUser.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleLogout} className="bg-transparent border border-red-500/50 text-red-400 py-2 px-4 uppercase tracking-widest text-sm transition-all duration-300 hover:bg-red-500 hover:text-white rounded-sm">
              Logout
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-serif">Saved Shipping Address</h3>
              {!isEditingAddress && (
                <button onClick={() => setIsEditingAddress(true)} className="text-sm text-brand-gold hover:underline">Edit Address</button>
              )}
            </div>
            
            {isEditingAddress ? (
              <form onSubmit={handleAddressSubmit} className="space-y-4 fade-in">
                <InputField id="name" name="name" label="Full Name" value={address.name} onChange={handleAddressChange} required />
                <InputField id="phone" name="phone" label="Contact Number" value={address.phone} onChange={handleAddressChange} required />
                <InputField id="address" name="address" label="Address" value={address.address} onChange={handleAddressChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <InputField id="zip" name="zip" label="ZIP / Postal Code" value={address.zip} onChange={handleAddressChange} required />
                  <InputField id="city" name="city" label="City" value={address.city} onChange={handleAddressChange} required />
                </div>
                <InputField id="country" name="country" label="Country" value={address.country} onChange={handleAddressChange} required />
                <div className="flex space-x-4 mt-4">
                  <button type="submit" className="bg-brand-gold text-black py-2 px-4 uppercase tracking-widest text-sm">Save</button>
                  <button type="button" onClick={() => setIsEditingAddress(false)} className="bg-gray-600 text-white py-2 px-4 uppercase tracking-widest text-sm">Cancel</button>
                </div>
              </form>
            ) : (
              currentUser.shippingAddress ? (
                <div className="text-gray-300 leading-relaxed">
                    <p>{currentUser.shippingAddress.name}</p>
                    <p>{currentUser.shippingAddress.phone}</p>
                    <p>{currentUser.shippingAddress.address}</p>
                    <p>{currentUser.shippingAddress.city}, {currentUser.shippingAddress.zip}</p>
                    <p>{currentUser.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-gray-400">You have no saved address.</p>
              )
            )}
        </div>

        <div className={'mt-8 border-t border-gray-700 pt-6'}>
            <h3 className="text-2xl font-serif mb-6">Order History</h3>
            {orders.length === 0 ? (
            <p className="text-gray-400">You have not placed any orders yet.</p>
            ) : (
            <div className="space-y-6">
                {orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => {
                  const remainingBalance = order.totalValue - order.amountPaid;
                  return (
                    <div key={order.id} className="border border-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                            <div>
                                <p className="font-semibold">Order ID: <span className="text-gray-300">{order.id}</span></p>
                                <p className="text-sm text-gray-400">Date: {new Date(order.date).toLocaleDateString()}</p>
                                {order.razorpayOrderId && <p className="text-xs text-gray-500" title={order.razorpayOrderId}>Rzp Order ID: {order.razorpayOrderId}</p>}
                                {order.razorpayPaymentId && <p className="text-xs text-gray-500" title={order.razorpayPaymentId}>Rzp Payment ID: {order.razorpayPaymentId}</p>}
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-brand-gold">₹{order.totalValue.toFixed(2)}</p>
                                <p className="text-sm text-gray-300">Paid: ₹{order.amountPaid.toFixed(2)}</p>
                                {remainingBalance > 0 && (
                                  <p className="text-sm text-orange-400">Due: ₹{remainingBalance.toFixed(2)}</p>
                                )}
                                <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div>
                        {order.items.map(item => (
                            <div key={item.variantId} className="flex items-center text-sm mb-2">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover mr-4 rounded" onContextMenu={(e) => e.preventDefault()} />
                              <div className="flex-grow">
                                <span>{item.name} (x{item.quantity})</span>
                                {item.isPreOrder && <span className="text-xs ml-2 bg-brand-gold text-black px-2 py-0.5 rounded">PRE-ORDER</span>}
                              </div>
                            </div>
                        ))}
                        </div>
                    </div>
                  )
                })}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

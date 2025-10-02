import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

// TypeScript definitions for Razorpay
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

interface Razorpay {
  new (options: RazorpayOptions): {
    open(): void;
    on(event: 'payment.failed', callback: (response: any) => void): void;
  };
}

declare global {
  interface Window {
    Razorpay: Razorpay;
  }
}


const countries = ["United States","India", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "Brazil", "Mexico", "Spain", "Italy", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "Gabon", "Gambia", "Georgia", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Ivory Coast", "Jamaica", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

const countryCodeMap: { [key: string]: string } = {
  "United States": "us", "India": "in", "Canada": "ca", "United Kingdom": "gb",
  "Australia": "au", "Germany": "de", "France": "fr", "Japan": "jp", "Brazil": "br",
  "Mexico": "mx", "Spain": "es", "Italy": "it"
};

const InputField = ({id, label, ...props}: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input id={id} className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded disabled:bg-gray-700" {...props} />
  </div>
);

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, currentUser, addOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [useSavedAddress, setUseSavedAddress] = useState(!!currentUser?.shippingAddress);
  const [shippingInfo, setShippingInfo] = useState({
    name: '', phone: '', address: '', city: '', zip: '', country: ''
  });

  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState('');
  
  useEffect(() => {
    if (useSavedAddress && currentUser?.shippingAddress) {
      setShippingInfo(currentUser.shippingAddress);
    } else {
      setShippingInfo({
        name: currentUser?.email.split('@')[0] || '', phone: '', address: '', city: '', zip: '', country: ''
      });
    }
  }, [useSavedAddress, currentUser]);

  useEffect(() => {
    if (!shippingInfo.zip || !shippingInfo.country || useSavedAddress) {
      setZipError('');
      return;
    }

    const countryCode = countryCodeMap[shippingInfo.country];
    if (!countryCode) {
      setZipError('');
      return;
    }

    const handler = setTimeout(async () => {
      setZipLoading(true);
      setZipError('');
      try {
        const response = await fetch(`https://api.zippopotam.us/${countryCode}/${shippingInfo.zip}`);
        if (!response.ok) throw new Error('Invalid zip code for selected country.');
        const data = await response.json();
        const place = data.places[0];
        if (place) {
          setShippingInfo(prev => ({ ...prev, city: place['place name'] }));
        } else {
          throw new Error('Could not find city for this zip code.');
        }
      } catch (error: any) {
        setZipError(error.message);
      } finally {
        setZipLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [shippingInfo.zip, shippingInfo.country, useSavedAddress]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    if (name === 'zip' || name === 'phone') {
        value = value.replace(/[^0-9]/g, '');
    }
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const displayRazorpay = () => {
    if (!currentUser) {
      alert("Please log in to place an order.");
      return;
    }

    const options: RazorpayOptions = {
      key: 'rzp_test_ILz21sBCxfb86h', // IMPORTANT: Replace with your actual Razorpay Key ID
      amount: cartTotal * 100, // Amount is in currency subunits. 100 paise = 1 INR
      currency: "INR",
      name: "Velvet Nocturne",
      description: "Luxury Perfume Order",
      image: "https://picsum.photos/id/117/200/200", // Your logo URL
      handler: (response) => {
        addOrder({
          userId: currentUser.email,
          items: cart,
          total: cartTotal,
          shippingAddress: shippingInfo,
          paymentId: response.razorpay_payment_id
        });
        alert("Payment successful! Your order has been placed.");
        navigate('/account');
      },
      prefill: {
        name: shippingInfo.name,
        email: currentUser.email,
        contact: shippingInfo.phone,
      },
      notes: {
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}, ${shippingInfo.country}`,
      },
      theme: {
        "color": "#D4AF37"
      }
    };
    
    if (typeof window.Razorpay === 'undefined') {
        alert('Razorpay SDK not loaded. Please check your internet connection.');
        return;
    }

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', (response: any) => {
        alert('Payment failed. Please try again.');
        console.error('Payment failed: ', response.error.description);
    });
    paymentObject.open();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(step === 1) {
      if (zipError) {
        alert("Please fix the shipping address errors before proceeding.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      displayRazorpay();
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 fade-in">
      <h1 className="text-4xl font-serif text-center mb-12">Checkout</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="fade-in">
              <h2 className="text-2xl font-serif mb-6">Shipping Information</h2>
              
              {currentUser?.shippingAddress && (
                <div className="mb-6 p-4 border border-brand-gold/20 bg-brand-dark rounded-md">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={useSavedAddress}
                      onChange={() => setUseSavedAddress(!useSavedAddress)}
                      className="h-5 w-5 bg-gray-900 border-gray-600 text-brand-gold focus:ring-brand-gold rounded"
                    />
                    <span className="ml-3 text-white">Use my saved shipping address</span>
                  </label>
                </div>
              )}

              <div className="space-y-6">
                <InputField id="name" name="name" label="Full Name" value={shippingInfo.name} onChange={handleInputChange} required disabled={useSavedAddress} />
                <InputField id="phone" name="phone" label="Contact Number" value={shippingInfo.phone} onChange={handleInputChange} required type="tel" inputMode="numeric" disabled={useSavedAddress} />
                <InputField id="address" name="address" label="Address" value={shippingInfo.address} onChange={handleInputChange} required disabled={useSavedAddress} />
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded h-[50px] disabled:bg-gray-700"
                      required
                      disabled={useSavedAddress}
                    >
                      <option value="">Select Country</option>
                      {countries.sort().map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField id="zip" name="zip" label="ZIP / Postal Code" value={shippingInfo.zip} onChange={handleInputChange} required type="tel" inputMode="numeric" disabled={useSavedAddress} />
                  <InputField id="city" name="city" label="City" value={shippingInfo.city} onChange={handleInputChange} required disabled={useSavedAddress} />
                </div>
                <div className="h-4 mt-1 text-sm">
                  {zipLoading && <p className="text-brand-gold">Looking up city...</p>}
                  {zipError && <p className="text-red-500">{zipError}</p>}
                </div>
                <button type="submit" className="mt-6 w-full bg-brand-gold text-black py-3 font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h2 className="text-2xl font-serif mb-6">Confirm Payment</h2>
              <div className="bg-brand-dark p-6 border border-gray-700 rounded-md space-y-3 mb-6">
                  <div>
                      <span className="text-gray-400 block">Ship to:</span>
                      <p className="font-semibold">{shippingInfo.name}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.zip}, {shippingInfo.country}</p>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold border-t border-gray-700 pt-3">
                      <span>Total to pay:</span>
                      <span className="text-brand-gold">₹{cartTotal.toFixed(2)}</span>
                  </div>
              </div>
              <button type="submit" className="w-full bg-brand-gold text-black py-3 font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
                Pay with Razorpay
              </button>
              <button onClick={() => setStep(1)} type="button" className="mt-4 w-full text-center text-gray-400 hover:text-white">
                Back to Shipping
              </button>
            </div>
          )}
        </form>

        {/* Order Summary */}
        <div className="bg-brand-dark p-8 border border-gray-800 h-fit">
          <h2 className="text-2xl font-serif mb-6">Your Order</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.variantId} className="flex justify-between items-start">
                <div className="flex">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4"/>
                  <div>
                    <p>{item.name}</p>
                    {item.isPreOrder && <span className="text-xs bg-brand-gold text-black px-2 py-0.5 rounded">PRE-ORDER</span>}
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6">
            <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-brand-gold">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
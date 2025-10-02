import React from 'react';
import * as storage from '../services/storageService';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const newSubmission = {
      id: Date.now().toString(),
      name,
      email,
      message,
      date: new Date().toISOString(),
    };
    
    const submissions = storage.getContactSubmissions();
    storage.saveContactSubmissions([...submissions, newSubmission]);

    alert("Thank you for your message. We will get back to you shortly.");
    form.reset();
  };
  
  return (
    <div className="container mx-auto px-6 py-20 fade-in">
      <h1 className="text-5xl font-serif text-center mb-4">Contact Us</h1>
      <p className="text-center text-gray-400 mb-12">We would love to hear from you.</p>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" id="name" name="name" className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" id="email" name="email" className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea id="message" name="message" rows={5} className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded" required></textarea>
          </div>
          <button type="submit" className="w-full bg-brand-gold text-black py-3 font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <h3 className="text-xl font-serif text-brand-gold mb-2">Customer Service</h3>
             <div className="text-sm space-y-1 text-gray-300">
              <p className="pt-2">For any inquiry, contact customer support:</p>
              <a href="tel:+917719697743" className="block hover:text-brand-gold transition-colors">+91 7719697743</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-serif text-brand-gold mb-2">Email Us</h3>
            <a href="mailto:velvetnocturne77@gmail.com" className="hover:text-brand-gold transition-colors">velvetnocturne77@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
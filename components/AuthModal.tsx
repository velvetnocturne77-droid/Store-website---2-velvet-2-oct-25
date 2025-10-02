
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import * as storage from '../services/storageService';
import Modal from './Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      login(user);
      onClose();
      setError('');
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    const success = register({ email, password, isAdmin: false });
    if (success) {
      onClose();
      setError('');
      setEmail('');
      setPassword('');
    } else {
      setError('An account with this email already exists.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-3xl font-serif text-brand-gold mb-6 text-center">{isLoginView ? 'Login' : 'Sign Up'}</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={isLoginView ? handleLogin : handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-brand-gold text-black py-3 font-bold uppercase tracking-wider rounded transition-opacity hover:opacity-90">
          {isLoginView ? 'Login' : 'Create Account'}
        </button>
      </form>
      <p className="text-center mt-6">
        {isLoginView ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-brand-gold font-semibold">
          {isLoginView ? 'Sign up' : 'Login'}
        </button>
      </p>
    </Modal>
  );
};

export default AuthModal;

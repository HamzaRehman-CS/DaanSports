import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY)) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) ||
  "pk_test_ZnVua3ktZXdlLTU3LmNsZXJrLmFjY291bnRzLmRldiQ";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </ClerkProvider>
  </React.StrictMode>
);

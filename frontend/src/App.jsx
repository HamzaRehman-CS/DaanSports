import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import CustomerOrders from './Pages/CustomerOrders';
import GenericPage from './Pages/GenericPage';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#dc2626] selection:text-white">
      <BrowserRouter>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route 
              path="/tracksuits" 
              element={<ShopCategory category="Tracksuits" title="Wholesale Tracksuits & Joggers" subtitle="Engineered fleece & polyester tracksuits for teams, clubs, and retailers (MOQ 50 Pcs)" />} 
            />
            <Route 
              path="/sweatshirts" 
              element={<ShopCategory category="Sweatshirts" title="Bulk Sweatshirts & Hoodies" subtitle="300+ GSM heavyweight fleece hoodies & pullovers with custom logo printing" />} 
            />
            <Route 
              path="/activewear" 
              element={<ShopCategory category="Activewear" title="Performance Activewear & Compression" subtitle="Breathable moisture-wicking gym tees, shorts, and compression wear" />} 
            />
            <Route 
              path="/tshirts" 
              element={<ShopCategory category="T-Shirts" title="Wholesale Athletic Tees & Jerseys" subtitle="Custom team jerseys, polo shirts, and training tees for bulk distribution" />} 
            />
            <Route 
              path="/outerwear" 
              element={<ShopCategory category="Outerwear" title="Bulk Sports Jackets & Windbreakers" subtitle="Weatherproof athletic outerwear, softshell jackets, and padded vests" />} 
            />
            <Route 
              path="/trousers" 
              element={<ShopCategory category="Trousers" title="Trousers & Sweatpants Collection" subtitle="Wholesale 330 GSM combed fleece joggers & warm-up pants (10% OFF Special)" />} 
            />
            <Route path="/category/:categoryId" element={<ShopCategory />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/about" element={<GenericPage />} />
            <Route path="/manufacturing" element={<GenericPage />} />
            <Route path="/oem" element={<GenericPage />} />
            <Route path="/certifications" element={<GenericPage />} />
            <Route path="/contact" element={<GenericPage />} />
            <Route path="/privacy" element={<GenericPage />} />
            <Route path="/terms" element={<GenericPage />} />
            <Route path="/returns" element={<GenericPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

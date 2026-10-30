import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../Components/Dashboard/Dashboard';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ProductList from '../../Components/ProductList/ProductList';
import OrderManager from '../../Components/OrderManager/OrderManager';
import SiteManager from '../../Components/SiteManager/SiteManager';
import VoucherManager from '../../Components/VoucherManager/VoucherManager';
import CategoryManager from '../../Components/CategoryManager/CategoryManager';
import BannerManager from '../../Components/BannerManager/BannerManager';

const Admin = ({ sidebarOpen, onCloseSidebar }) => {
  return (
    <div className='admin'>
      <Sidebar isOpen={sidebarOpen} onClose={onCloseSidebar} />
      <main className="admin-main-container">
        <Routes>
          {/* Dashboard & Metrics */}
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/' element={<Dashboard />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />

          {/* Wholesale Products */}
          <Route path='/list-product' element={<ProductList />} />
          <Route path='/admin/list-product' element={<ProductList />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/admin/add-product' element={<AddProduct />} />

          {/* Categories & Dynamic Banners */}
          <Route path='/categories' element={<CategoryManager />} />
          <Route path='/admin/categories' element={<CategoryManager />} />
          <Route path='/banners' element={<BannerManager />} />
          <Route path='/admin/banners' element={<BannerManager />} />

          {/* Orders, Vouchers & CMS */}
          <Route path='/orders' element={<OrderManager />} />
          <Route path='/admin/orders' element={<OrderManager />} />
          <Route path='/vouchers' element={<VoucherManager />} />
          <Route path='/admin/vouchers' element={<VoucherManager />} />
          <Route path='/cms' element={<SiteManager />} />
          <Route path='/admin/cms' element={<SiteManager />} />

          {/* Catch-all fallback to Dashboard */}
          <Route path='*' element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;

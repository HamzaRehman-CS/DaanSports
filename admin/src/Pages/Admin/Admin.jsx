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

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/add-product' element={<AddProduct/>}/>
        <Route path='/list-product' element={<ProductList/>}/>
        <Route path='/categories' element={<CategoryManager/>}/>
        <Route path='/banners' element={<BannerManager/>}/>
        <Route path='/orders' element={<OrderManager/>}/>
        <Route path='/vouchers' element={<VoucherManager/>}/>
        <Route path='/cms' element={<SiteManager/>}/>
      </Routes>
    </div>
  );
};

export default Admin;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import AddOrEditProduct from './pages/AddOrEditProduct';
import AdminProducts from './pages/AdminProducts';
import NotFound from './pages/NotFound';
import ProductDetail from './components/ProductDetail';
import Orders from './pages/Orders';
import Login from './pages/Login';
import { useState } from 'react';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/add-product" element={<AddOrEditProduct />} />
          <Route path="/admin/edit-product/:productId" element={<AddOrEditProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

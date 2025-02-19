import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust the path based on your project structure
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import AdminProducts from './pages/AdminProducts';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/edit-product/:productId" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

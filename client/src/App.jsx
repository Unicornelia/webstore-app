import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjust the path based on your project structure
import Home from "./pages/Home";
import { useEffect, useState } from 'react';
import Products from "./pages/Products";
import Cart from "./pages/Cart";
// import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import AdminProducts from "./pages/AdminProducts";
import NotFound from './pages/NotFound';

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products") // Adjust API endpoint as needed
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/products" element={<Products products={products} />} />
          <Route path="/cart" element={<Cart />} />
          {/*<Route path="/orders" element={<Orders />} />*/}
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

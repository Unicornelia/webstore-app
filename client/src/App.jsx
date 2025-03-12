import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
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
import SignUp from './pages/SignUp';
import ResetPw from './components/ResetPw';
import NewPassword from './pages/NewPassword';

const App = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((e) => console.error(`Fetch error in navbar: ${e}`));
  }, []);

  // Fetch the CSRF token when the app mounts
  useEffect(() => {
    fetch('http://localhost:3001/csrf-token', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((response) => {
        setCsrfToken(response.csrfToken);
      })
      .catch((e) => console.error(`Fetch error in getting csrf-token: ${e}`));
  }, []);

  return (
    <Router>
      <Navbar
        csrfToken={csrfToken}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products csrfToken={csrfToken} />} />
          <Route path="/products/:productId" element={<ProductDetail csrfToken={csrfToken} />} />
          <Route path="/cart" element={isAuthenticated ? <Cart csrfToken={csrfToken} /> : <Navigate to="/" replace />} />
          <Route path="/orders" element={isAuthenticated ? <Orders csrfToken={csrfToken} /> : <Navigate to="/" replace />} />
          <Route path="/admin/add-product" element={isAuthenticated ? <AddOrEditProduct csrfToken={csrfToken} /> : <Navigate to="/" replace />} />
          <Route path="/admin/edit-product/:productId"
                 element={isAuthenticated ? <AddOrEditProduct csrfToken={csrfToken} /> : <Navigate to="/" replace />} />
          <Route path="/admin/products" element={isAuthenticated ? <AdminProducts csrfToken={csrfToken} /> : <Navigate to="/" replace />} />
          <Route path="/login" element={<Login csrfToken={csrfToken} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp csrfToken={csrfToken} />} />
          <Route path="/reset" element={<ResetPw csrfToken={csrfToken} />} />
          <Route path="/reset/:token" element={<NewPassword csrfToken={csrfToken} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

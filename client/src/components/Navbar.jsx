import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = ({ csrfToken, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CSRF-TOKEN': csrfToken },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Invalid credentials');
      setIsAuthenticated(false);
      navigate('/');
    } catch (err) {
      console.error(err.message);
    }
  };

  const publicLinks = [
    { to: '/', label: 'Shop', exact: true },
    { to: '/products', label: 'Products' },
  ];

  const privateLinks = [
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'Orders' },
    { to: '/admin/add-product', label: 'Add Product' },
    { to: '/admin/products', label: 'Admin Products' },
  ];

  const authLinks = isAuthenticated
    ? [{ to: '/logout', label: 'Logout', isForm: true }]
    : [
      { to: '/login', label: 'Login' },
      { to: '/signup', label: 'Sign Up' },
    ];

  return (
    <header className="main-header">
      <nav className="main-header__nav">
        <ul className="main-header__item-list">
          {[...publicLinks, ...(isAuthenticated ? privateLinks : [])].map(({ to, label, exact }) => (
            <li key={to} className="main-header__item">
              <NavLink to={to} end={exact} className={({ isActive }) => (isActive ? 'active' : '')}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="main-header__item-list">
          {authLinks.map(({ to, label, isForm }) =>
            isForm ? (
              <li key={to} className="main-header__item">
                <form onSubmit={handleLogout}>
                  <input type="hidden" name="_csrf" value={csrfToken} />
                  <button type="submit">{label}</button>
                </form>
              </li>
            ) : (
              <li key={to} className="main-header__item">
                <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {label}
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

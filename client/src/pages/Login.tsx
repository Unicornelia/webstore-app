import { FC, FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { Token } from '../types';

interface LoginProps extends Token {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: FC<LoginProps> = ({ csrfToken, setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<unknown | string>('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      if (data.errorMessage?.length > 0) {
        setError(data.errorMessage);
      } else {
        setIsAuthenticated(data.isAuthenticated);
        navigate('/');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : e);
    }
  };

  return (
    <main className="login-page">
      <h2>Login</h2>
      {error ? <p className="error">`${error.toString()}`</p> : null}
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <NavLink to={'/reset'} className="reset-link">
          Forgot Password?
        </NavLink>
      </form>
    </main>
  );
};

export default Login;

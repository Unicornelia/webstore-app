import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SignUp.css';

const SignUp = ({ csrfToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CSRF-TOKEN': csrfToken },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Signup failed!');
      const data = await response.json();
      if (data.errorMessage?.length > 0) {
        setError(data.errorMessage);
      } else {
        alert('Successful signup!');
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="signup-container">
      <h2>Create an Account</h2>
      {error && <p className="error">{error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>

        <div className="form-control">
          <label htmlFor="email">Email Address</label>
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

        <div className="form-control">
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

        <div className="form-control">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn">Sign Up</button>
      </form>
    </main>
  );
};

export default SignUp;

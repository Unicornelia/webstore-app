import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const ResetPw = ({ csrfToken }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CSRF-TOKEN': csrfToken },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      console.log(data, 'data in resetpw');
      if (data.errorMessage?.length > 0) {
        setError(data.errorMessage);
      } else {
        alert(`Got it! We sent an email to ${data.email}. Check your email and reset your password`);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="login-page">
      <h2>Reset Your Password</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required autoComplete="off" />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </main>
  );
};

export default ResetPw;

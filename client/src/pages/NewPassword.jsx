import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Login.css';

const NewPassword = ({ csrfToken }) => {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [userDetails, setUserDetails] = useState({ userId: '', passwordToken: '' });
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch(`http://localhost:3001/reset/${token}`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json', 'CSRF-TOKEN': csrfToken },
            });
            const data = await response.json();
            setUserDetails({ userId: data.userId, passwordToken: data.passwordToken });
          } catch (e) {
            console.error(e);
          }
        }

        fetchData();
      }, [csrfToken, token],
    );


    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {
        const response = await fetch('http://localhost:3001/new-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'CSRF-TOKEN': csrfToken },
          credentials: 'include',
          body: JSON.stringify({ ...formData, userId: userDetails.userId, passwordToken: userDetails.passwordToken }),
        });
        if (!response.ok) throw new Error('Invalid credentials');
        const data = await response.json();
        if (data.errorMessage?.length > 0) {
          setError(data.errorMessage);
        } else {
          alert(`Your password has been updated successfully.`);
          navigate('/login');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <main className="login-page">
        <h2>Update Your Password</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required autoComplete="off" />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                   autoComplete="off" />
          </div>
          <button type="submit">Save Password</button>
        </form>
      </main>
    );
  }
;

export default NewPassword;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import './login.css';

const StaffLogin = ({ setStaff }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/staff/login-staff', formData);
      const { token, role, _id, name, email } = res.data;

      // Store staff token and info
      localStorage.setItem('staffToken', token);
      localStorage.setItem('staffRole', role);
      const staffData = { _id, name, email, role, token };
      localStorage.setItem('staffData', JSON.stringify(staffData));

      if (setStaff) setStaff(staffData);

      // Route based on role
      if (role === 'admin' || role === 'firstlevelAdmin' || role === 'manager') {
        navigate('/staff/dashboard');
      } else {
        navigate('/staff/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT: cake image */}
        <div className="login-left" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&auto=format&fit=crop&q=80')`
        }}>
          <div className="login-left-content">
            <h2>Chara Cakes</h2>
            <p>Staff &amp; Management Portal</p>
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Staff Sign In</h2>
            <p className="subtitle">Access the Chara Cakes management system</p>

            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" placeholder="staff@characakes.com"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'} name="password"
                  placeholder="••••••••" value={formData.password}
                  onChange={handleChange} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </span>
              </div>
            </div>

            <div className="options">
              <label className="remember-me">
                <input className="checkbox" type="checkbox" />
                <p>Remember me</p>
              </label>
              <span className="forgot">Forgot password?</span>
            </div>

            <button type="submit" className="login-btn">Sign In</button>

            <p className="signup">
              Customer portal?{' '}
              <Link to="/login" className="span">Customer Login</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default StaffLogin;

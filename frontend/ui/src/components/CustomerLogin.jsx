import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import './login.css';

const CustomerLogin = ({ setCustomer }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/customer/login', formData);
      if (res.data.token) localStorage.setItem('customerToken', res.data.token);
      setCustomer(res.data.customer);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* ── LEFT: cake image ── */}
        <div className="login-left">
          <div className="login-left-content">
            <h2>Chara Cakes</h2>
            <p>Bite into bliss, every single day.</p>
          </div>
        </div>

        {/* ── RIGHT: sign-in form ── */}
        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to your Chara Cakes account</p>

            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" placeholder="you@email.com"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" placeholder="••••••••"
                  value={formData.password} onChange={handleChange} required
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              Don't have an account?{' '}
              <Link to="/register" className="span">Create Account</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CustomerLogin;

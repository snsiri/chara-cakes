import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import './login.css';

const CustomerRegister = ({ setCustomer }) => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const validatePw = (pw) => !passwordRegex.test(pw)
    ? 'Min 8 chars with uppercase, lowercase, number & special character.'
    : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') setPasswordError(validatePw(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setPasswordError('');
    const pwErr = validatePw(formData.password);
    if (pwErr) { setPasswordError(pwErr); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    try {
      const res = await api.post('/api/auth/customer/register', {
        name: formData.name, email: formData.email,
        password: formData.password, confirmPassword: formData.confirmPassword
      });
      localStorage.setItem('customerToken', res.data.token);
      setCustomer(res.data.customer);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* ── LEFT: cake image ── */}
        <div className="login-left">
          <div className="login-left-content">
            <h2>Join Chara Cakes</h2>
            <p>Your sweetest moments start here.</p>
          </div>
        </div>

        {/* ── RIGHT: register form ── */}
        <div className="register-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p className="subtitle">Join us for delicious cakes &amp; sweet deals</p>

            {error        && <p className="error-message">{error}</p>}
            {passwordError && <p className="error-message">{passwordError}</p>}

            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" placeholder="Your full name"
                value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" placeholder="you@email.com"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div className="password-wrapper">
                <input type={showPassword ? 'text' : 'password'} name="password"
                  placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <div className="password-wrapper">
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword"
                  placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn" style={{ marginTop: 8 }}>Create Account</button>

            <p className="signup">
              Already have an account?{' '}
              <Link to="/login" className="span">Sign In</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CustomerRegister;

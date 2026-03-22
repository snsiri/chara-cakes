import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react"; // optional 
import axios from 'axios';
import './login.css';

const StaffLogin = ({setStaff}) => {
    const[formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            // Handle login logic 
            const res = await axios.post('/api/auth/customer/login', formData);
            localStorage.setItem('token', res.data.token);
            console.log(res.data);
            setCustomer(res.data);
            navigate ("/");
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };
  
 return (
  
    <div className="login-page">
     <div className="login-container">
        {/* LEFT SIDE */}
        <div className="login-left">
        </div>
        {/* RIGHT SIDE */}
        <div className="login-right">
         
          <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
{error && <p className="error-message">{error}</p>}
            <div className="form-group">
            
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
               <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                
                  <span
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                </div>
            </div>
          <div className="options">
            <label className='remember-me'>
              <input className="checkbox" type="checkbox"  /> 
              
              <p>Remember me</p>
            </label>
            <span className="forgot">Forgot password</span>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        

        <p className="signup">
          Don’t have an account? <Link to='/register' className='span'>Create Account</Link>
        </p>
        </form>
      </div>
        

      </div>
    </div>
    
  );
};

export default CustomerLogin;
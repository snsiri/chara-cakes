import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react"; // optional
import api from '../api/axios';
import './login.css';

const CustomerRegister = ({setCustomer}) => {
    const[formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword:''
    });
    
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    const validatePassword =(password)=>{
        if (!passwordRegex.test(password)) {
            return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
        }
        return "";
        
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({...formData, [name]:value });

        if (name === "password") {
            setPasswordError(validatePassword(value));
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        setError("");
        setPasswordError("");


        // Password strength check
        const passwordValidationMessage = validatePassword(formData.password);
        if (passwordValidationMessage) {
            setPasswordError(passwordValidationMessage);
            return;
        }


        // Confirm password match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        
        try {
            // Handle login logic 
            const res = await api.post('/api/auth/customer/register', 
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }
            );
            localStorage.setItem('customerToken', res.data.token);
            console.log(res.data);
            setCustomer(res.data.customer);
            navigate ("/");
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };
  
 return (
    <div className="login-page">
     <div className="login-container">
        {/* LEFT SIDE */}
        <div className="login-left">
        </div>
        {/* RIGHT SIDE */}
        <div className="register-right">
          
        
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Register</h2>
             {error && <p className="error-message">{error}</p>}
             {passwordError && <p className="error-message">{passwordError}</p>}

             <div className="form-group">
            
              <label>Name *</label>
              <input
                type="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
            
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
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

             <div className="form-group">
              <label>Confirm Password *</label>
               <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="********"
                    value={formData.confirmPassword}
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
           
          </div>

          <button type="submit" className="login-btn">
            Register
          </button>
        

        <p className="signup">
          Already have an account? <Link to='/login' className='span'>Sign In</Link>
        </p>
        </form>
      </div>
        

      </div>
    </div>
  );
};

export default CustomerRegister;
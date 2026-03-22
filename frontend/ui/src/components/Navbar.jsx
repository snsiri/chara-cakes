import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({customer, setCustomer}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

//   useEffect(() => {
//   setDropdownOpen(false); // Close dropdown whenever user state changes
// }, [customer]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () =>{
    localStorage.removeItem("customerToken");
    setCustomer(null);
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Chara Cakes
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cakes">Cakes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/customizes">Custom Cakes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>


          <div className="nav-right" key={customer? 'auth':'guest'}>
          <form className="search-form" onSubmit={handleSearch}>
             
            <div className="search-container">
              <input
                type="search"
                placeholder="Search..."
                className="search-input"
                spellCheck="false"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
              </button>
            </div>
          </form>

              <Link to="/cart" className="cart-icon-container">
                <svg className="bi bi-cart3" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                </svg>
              </Link>
           
                {customer ? (
                      <div className="dropdown">
                        {/* Use a span or button here instead of Link to prevent conflict */}
                        <span 
                          className="profile-icon-container" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false" 
                          style={{ cursor: 'pointer' }}
                        >
                          <svg className="bi bi-person" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                          </svg>
                        </span>
                        <ul className="dropdown-menu dropdown-menu-start">
                          <li><Link className="dropdown-item" to="/customerProfile">My Profile</Link></li>
                          <li><button className="dropdown-item" type="button" onClick={handleLogout}>Log Out</button></li>
                        </ul>
                      </div>
                    ) : (
                      <Link to="/login" className="auth-button">Sign in / Register</Link>
                    )}
                  
           
   
            
          
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;

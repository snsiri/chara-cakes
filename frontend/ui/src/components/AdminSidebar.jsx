import React from "react";
import {Link, useNavigate }from 'react-router-dom'
import "./adminDashboard.css"

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      // Clear the JWT token from localStorage
      localStorage.removeItem('adminToken');
      // Redirect to login page
      navigate('/admin/login');
    }
  };

  return (
    <div className="sidebar">
      <div className="logo"></div>
      <ul className="menu">
        <li className="active">
          <Link to="/admin">
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/admin">
            <i className="fas fa-chart-bar"></i>
            <span>Inventory</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/manage-products">
            <i className="Products"></i>
            <span>Products</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/customizes1">
            <i className="Customize"></i>
            <span>Customize Products</span>
          </Link>
        </li>
        <li>
          <Link to="/admin">
            <i className="fas fa-briefcase"></i>
            <span>Staff</span>
          </Link>
        </li>
        <li>
          <Link to="/admin">
            <i className="Customers"></i>
            <span>
              Customers
            </span>
          </Link>
        </li>
         <li>
          <Link to="/admin/orders">
            <i className="Orders"></i>
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link to="/admin">
            <i className="fas fa-question-circle"></i>
            <span>Website</span>
          </Link>
        </li>

        <li>
          <Link to="/admin">
            <i className="fas fa-star"></i>
            <span>Finances</span>
          </Link>
        </li>

        <li>
          <Link to="/admin">
            <i className="fas fa-cog"></i>
            <span>Profile</span>
          </Link>
        </li>

        {/* <li className="logout">
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </li> */}
      </ul>
    </div>
  );
};

export default AdminSidebar;
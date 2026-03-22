import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./CustomerSidebar.css" 

const CustomerSidebar = ({customer, setCustomer }) => {
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   const confirmLogout = window.confirm('Are you sure you want to logout?');
    
  //   if (confirmLogout) {
  //     localStorage.removeItem("customerToken");
  //     setCustomer(null);
  //     navigate("/");
  //   }
  // };
const handleLogout = () =>{
    localStorage.removeItem("customerToken");
    setCustomer(null);
    navigate("/");
  }

return(
  <div className="sidebar-container ">
   
    <ul className="list-unstyled ps-0">
      <li className="mb-1">
        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
          Profile
        </button>
        <div className="collapse show" id="home-collapse">
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" className="link-dark rounded">Lost Password</a></li>
            <li><a href="#" className="link-dark rounded">Delete Account</a></li>
            <li><a href="#" className="link-dark rounded">Addresses</a></li>
          </ul>
        </div>
      </li>
      <li className="mb-1">
        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
          Wishlist
        </button>
        <div className="collapse" id="dashboard-collapse">
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" className="link-dark rounded">Customized Cakes</a></li>
            <li><a href="#" className="link-dark rounded">Other Favorites</a></li>
          </ul>
        </div>
      </li>

      <li className="mb-1">
        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
          Orders
        </button>
        <div className="collapse" id="orders-collapse">
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" className="link-dark rounded">Completed Orders</a></li>
            <li><a href="#" className="link-dark rounded">Orders in Progress</a></li>
          </ul>
        </div>
      </li>
      
      <li className="mb-1">
        <button className="btn align-items-center" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
          Customized Cakes
        </button>
        <button className="btn align-items-center" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
          Reviews
        </button>
        <button className="btn btn align-items-center rounded"   onClick={handleLogout}>
          Log Out
        </button>
        
      </li>
    </ul>
  </div>

);
};
export default CustomerSidebar;
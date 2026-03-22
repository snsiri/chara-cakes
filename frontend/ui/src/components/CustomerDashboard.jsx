import React, { useState, useEffect } from 'react'
import "./adminDashboard.css"; // Import the CSS file
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminAdminSidebar";

const CustomerDashboard = () => {
  const [kpiData, setKpiData] = useState({
    totalIngredients: 0,
    lowStockItems: 0,
    nearExpiryItems: 0,
    totalQuantity: 0
  });

  useEffect(() => {
    // Fetch KPI data from your backend
    const fetchKpiData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/IngredientStock/kpi', {
          method: 'GET',

          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received KPI data:', data);
        setKpiData(data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };

    fetchKpiData();
  }, []);

  return (
    <div className="body">
      <AdminSidebar />
      <div className="main--content">
        <div className="header--wrapper">
          <div className="header--title">
            <span>Admin</span>
            <h2>Dashboard</h2>
          </div>
          <div className="user--info">
            <div className="search--box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </div>

        <div className="card--container">
          <h3 className="main--title">Inventory Overview</h3>
          <div className="card--wrapper">
            <div className="payment--card light-blue">
              <div className="card--header">
                <div className="amount">
                  <span className="title">Total Ingredients</span>
                  <span className="amount-value">{kpiData.totalIngredients}</span>
                </div>
                <i className="fas fa-boxes icon"></i>
              </div>
              <span className="card-detail">Unique items in inventory</span>
            </div>

            <div className="payment--card light-red">
              <div className="card--header">
                <div className="amount">
                  <span className="title">Low Stock Items</span>
                  <span className="amount-value">{kpiData.lowStockItems}</span>
                </div>
                <i className="fas fa-exclamation-triangle icon"></i>
              </div>
              <span className="card-detail">Items below threshold</span>
            </div>

            <div className="payment--card light-purple">
              <div className="card--header">
                <div className="amount">
                  <span className="title">Near Expiry Items</span>
                  <span className="amount-value">{kpiData.nearExpiryItems}</span>
                </div>
                <i className="fas fa-clock icon"></i>
              </div>
              <span className="card-detail">Items expiring soon</span>
            </div>

            <div className="payment--card light-green">
              <div className="card--header">
                <div className="amount">
                  <span className="title">Total Quantity</span>
                  <span className="amount-value">{kpiData.totalQuantity}</span>
                </div>
                <i className="fas fa-chart-bar icon"></i>
              </div>
              <span className="card-detail">Total items in stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard;

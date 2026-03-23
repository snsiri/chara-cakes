import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = ({ staff: propStaff }) => {
  const staff = propStaff || JSON.parse(localStorage.getItem('staffData') || 'null');
  const role = staff?.role || localStorage.getItem('staffRole') || 'staff';
  const isAdmin = ['admin', 'firstlevelAdmin', 'manager'].includes(role);

  const [kpiData, setKpiData] = useState({
    totalIngredients: 0, lowStockItems: 0, nearExpiryItems: 0, totalQuantity: 0
  });
  const [orderStats, setOrderStats] = useState({ pending: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('staffToken');
        const headers = { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };

        const kpiRes = await fetch('http://localhost:3000/api/IngredientStock/kpi', { headers });
        if (kpiRes.ok) setKpiData(await kpiRes.json());

        const ordersRes = await fetch('http://localhost:3000/api/orders/get', { headers });
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          setOrderStats({ total: orders.length, pending: orders.filter(o => !o.isDelivered).length, completed: orders.filter(o => o.isDelivered).length });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const kpiCards = [
    { label: 'Total Ingredients', value: kpiData.totalIngredients, icon: '🥚', color: '#e8f4fd', accent: '#4a90d9', desc: 'Unique items tracked' },
    { label: 'Low Stock', value: kpiData.lowStockItems, icon: '⚠️', color: '#fff4e6', accent: '#f5a623', desc: 'Items below threshold' },
    { label: 'Near Expiry', value: kpiData.nearExpiryItems, icon: '⏰', color: '#fef3f3', accent: '#c85050', desc: 'Expiring within 7 days' },
    { label: 'Total Quantity', value: kpiData.totalQuantity, icon: '📦', color: '#f0faf0', accent: '#4caf50', desc: 'Units in stock' },
  ];

  const orderCards = [
    { label: 'Pending Orders', value: orderStats.pending, icon: '🕐', color: '#fff8e6', accent: '#f5a623', path: '/staff/orders' },
    { label: 'Total Orders', value: orderStats.total, icon: '📋', color: '#f0f4ff', accent: '#6b7ff0', path: '/staff/orders' },
    { label: 'Completed', value: orderStats.completed, icon: '✅', color: '#f0faf0', accent: '#4caf50', path: '/staff/completed-orders' },
  ];

  const quickLinks = [
    { label: 'Manage Orders', icon: '📦', path: '/staff/orders', show: true },
    { label: 'Manage Products', icon: '🎂', path: '/staff/manage-products', show: isAdmin },
    { label: 'Custom Cakes', icon: '🎨', path: '/staff/customizes', show: true },
    { label: 'Manage Staff', icon: '👥', path: '/staff/manage-staff', show: isAdmin },
    { label: 'Inventory', icon: '🏭', path: '/staff/inventory', show: isAdmin },
    { label: 'Reviews', icon: '⭐', path: '/staff/reviews', show: isAdmin },
  ].filter(l => l.show);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,600&display=swap');

        .staff-layout {
          display: flex;
          min-height: calc(100vh - 68px);
          background: #fdf8f6;
          font-family: 'Quicksand', sans-serif;
        }

        .staff-main {
          flex: 1;
          padding: 36px 40px;
          overflow-y: auto;
          min-width: 0;
        }

        /* Header */
        .dash-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dash-greeting {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c85050;
          margin-bottom: 4px;
        }
        .dash-title {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 2rem;
          color: #3d1818;
          margin: 0;
          font-weight: 600;
        }
        .dash-date {
          font-size: 0.84rem;
          color: #b08080;
          font-weight: 500;
        }

        /* Section label */
        .dash-section-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c85050;
          margin: 0 0 16px;
        }

        /* KPI grid */
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 36px;
        }
        .dash-grid-3 { grid-template-columns: repeat(3, 1fr); }

        .dash-card {
          background: white;
          border-radius: 16px;
          padding: 22px 24px;
          border: 1px solid #f5dede;
          box-shadow: 0 2px 12px rgba(160,60,60,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dash-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(160,60,60,0.10);
        }

        .dash-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .dash-card-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #8c5050;
          letter-spacing: 0.04em;
        }
        .dash-card-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
        }
        .dash-card-value {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #3d1818;
          line-height: 1;
          margin-bottom: 6px;
        }
        .dash-card-desc {
          font-size: 0.76rem;
          color: #b08080;
          font-weight: 500;
        }

        /* Quick links */
        .dash-quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 36px;
        }

        .dash-quick-link {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #f5dede;
          border-radius: 14px;
          padding: 16px 18px;
          text-decoration: none !important;
          color: #5a2a2a;
          font-weight: 700;
          font-size: 0.88rem;
          font-family: 'Quicksand', sans-serif;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .dash-quick-link:hover {
          background: #fdf0f0;
          border-color: #e88585;
          transform: translateY(-2px);
          color: #c85050;
          text-decoration: none !important;
        }
        .dash-quick-icon {
          width: 38px; height: 38px;
          background: #fde8e8;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        /* Loading */
        .dash-loading {
          display: flex; align-items: center; justify-content: center;
          height: 200px; color: #b08080; font-weight: 600;
        }

        @media (max-width: 1100px) { .dash-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 700px) {
          .dash-grid { grid-template-columns: 1fr; }
          .dash-grid-3 { grid-template-columns: 1fr; }
          .dash-quick-grid { grid-template-columns: 1fr 1fr; }
          .staff-main { padding: 22px 18px; }
        }
      `}</style>

      <div className="staff-layout">
        <AdminSidebar staff={staff} />

        <main className="staff-main">
          {/* Header */}
          <div className="dash-header">
            <div>
              <p className="dash-greeting">Welcome back</p>
              <h1 className="dash-title">
                {staff?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="dash-date">
              {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </div>
          </div>

          {/* Inventory KPIs */}
          <p className="dash-section-label">Inventory Overview</p>
          {loading ? (
            <div className="dash-loading">Loading dashboard data…</div>
          ) : (
            <div className="dash-grid">
              {kpiCards.map((card, i) => (
                <div className="dash-card" key={i}>
                  <div className="dash-card-top">
                    <div className="dash-card-label">{card.label}</div>
                    <div className="dash-card-icon" style={{ background: card.color }}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="dash-card-value" style={{ color: card.accent }}>{card.value}</div>
                  <div className="dash-card-desc">{card.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Order stats */}
          <p className="dash-section-label">Order Overview</p>
          <div className={`dash-grid dash-grid-3`} style={{ marginBottom: 36 }}>
            {orderCards.map((card, i) => (
              <Link to={card.path} key={i} style={{ textDecoration: 'none' }}>
                <div className="dash-card">
                  <div className="dash-card-top">
                    <div className="dash-card-label">{card.label}</div>
                    <div className="dash-card-icon" style={{ background: card.color }}>{card.icon}</div>
                  </div>
                  <div className="dash-card-value" style={{ color: card.accent }}>{card.value}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick links */}
          <p className="dash-section-label">Quick Access</p>
          <div className="dash-quick-grid">
            {quickLinks.map((link, i) => (
              <Link key={i} to={link.path} className="dash-quick-link">
                <div className="dash-quick-icon">{link.icon}</div>
                {link.label}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;

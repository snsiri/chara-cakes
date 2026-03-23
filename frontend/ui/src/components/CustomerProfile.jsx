import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CustomerProfile = ({ customer, setCustomer }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', displayName:'',
    email:'', currentPassword:'', newPassword:'', confirmNewPassword:''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      const parts = (customer.name || '').split(' ');
      setFormData(p => ({
        ...p,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        displayName: customer.name || '',
        email: customer.email || ''
      }));
    }
  }, [customer]);

  useEffect(() => {
    if (activeTab === 'orders') {
      api.get('/api/orders/my-orders').then(r => setOrders(r.data)).catch(() => setOrders([]));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    setCustomer(null);
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match.'); return;
    }
    try {
      await api.put('/api/auth/customer/update', {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        ...(formData.newPassword && { currentPassword: formData.currentPassword, newPassword: formData.newPassword })
      });
      setSuccess('Account details saved!');
      setFormData(p => ({ ...p, currentPassword:'', newPassword:'', confirmNewPassword:'' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account.');
    }
  };

  const navItems = [
    { key: 'account',   label: 'Account details' },
    { key: 'orders',    label: 'Orders' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'password',  label: 'Lost password' },
  ];

  return (
    <>
    <style>{`
      /* All scoped under .pf- prefix to avoid any leakage */
      .pf-page {
        width: 100%;
        min-height: calc(100vh - 70px);
        background: #fff8f7;
        font-family: 'Quicksand', sans-serif;
      }

      /* hero banner */
      .pf-hero {
        background: linear-gradient(115deg, #e8857a 0%, #c96b60 100%);
        padding: 44px 60px 36px;
        color: #fff;
        width: 100%;
      }
      .pf-hero h1 {
        font-family: 'Playfair Display', serif;
        font-size: clamp(1.8rem, 4vw, 2.6rem);
        letter-spacing: 0.04em;
        margin: 0 0 6px;
        text-transform: uppercase;
        font-weight: 700;
        color: #fff;
      }
      .pf-hero-sub {
        font-size: 0.9rem;
        opacity: 0.88;
        font-weight: 500;
        color: #fff;
      }

      /* body layout */
      .pf-body {
        display: grid;
        grid-template-columns: 260px 1fr;
        max-width: 1140px;
        margin: 0 auto;
        padding: 48px 28px 64px;
        gap: 40px;
        align-items: start;
      }

      /* sidebar */
      .pf-sidebar { position: sticky; top: 90px; }

      .pf-user-badge {
        display: flex;
        align-items: center;
        gap: 14px;
        padding-bottom: 22px;
        margin-bottom: 4px;
        border-bottom: 1.5px solid #f0d5d0;
      }
      .pf-avatar {
        width: 50px; height: 50px; border-radius: 50%;
        background: linear-gradient(135deg, #e8857a, #c96b60);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Playfair Display', serif;
        font-size: 1.35rem; color: #fff; font-weight: 700;
        flex-shrink: 0;
        box-shadow: 0 3px 14px rgba(232,133,122,0.32);
      }
      .pf-user-name { font-weight: 700; color: #4a2020; font-size: 0.94rem; }
      .pf-user-id   { color: #a07070; font-size: 0.76rem; margin-top: 2px; }

      .pf-nav { list-style: none; padding: 0; margin: 4px 0 16px; }
      .pf-nav li { border-bottom: 1px solid #f0d5d0; }
      .pf-nav-btn {
        display: block; width: 100%; text-align: left;
        background: none; border: none;
        padding: 13px 0; font-family: 'Quicksand', sans-serif;
        font-size: 0.92rem; font-weight: 600; color: #7a3a3a;
        cursor: pointer; transition: color 0.18s, padding-left 0.18s;
      }
      .pf-nav-btn:hover { color: #e8857a; padding-left: 6px; }
      .pf-nav-btn.active { color: #e8857a; font-weight: 700; }

      .pf-logout-btn {
        display: block; width: 100%; text-align: left;
        background: none; border: none; padding: 13px 0;
        font-family: 'Quicksand', sans-serif;
        font-size: 0.92rem; font-weight: 600; color: #a07070; cursor: pointer;
      }
      .pf-logout-btn:hover { color: #c96b60; }

      /* content card */
      .pf-card {
        background: #fff; border-radius: 18px; padding: 44px 48px;
        box-shadow: 0 4px 30px rgba(180,60,60,0.07);
        border: 1px solid #f0d5d0;
      }
      .pf-card-title {
        font-family: 'Playfair Display', serif;
        color: #4a2020; font-size: 1.55rem;
        margin: 0 0 30px; text-align: center;
      }

      /* form */
      .pf-form-row {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 20px; margin-bottom: 20px;
      }
      .pf-fg { display: flex; flex-direction: column; margin-bottom: 20px; }

      .pf-label {
        font-size: 0.7rem; font-weight: 700; color: #7a3a3a;
        margin-bottom: 7px; letter-spacing: 0.09em; text-transform: uppercase;
      }
      .pf-label span { color: #e8857a; margin-left: 2px; }

      .pf-input {
        border: 1.5px solid #f0d5d0; border-radius: 10px;
        padding: 11px 14px; font-family: 'Quicksand', sans-serif;
        font-size: 0.94rem; color: #4a2020; background: #fff;
        transition: border-color 0.2s, box-shadow 0.2s; outline: none; width: 100%;
      }
      .pf-input:focus {
        border-color: #e8857a;
        box-shadow: 0 0 0 3px rgba(232,133,122,0.13);
      }

      .pf-hint {
        font-size: 0.76rem; color: #a07070;
        font-style: italic; margin-top: 5px; line-height: 1.4;
      }

      .pf-section-sep {
        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
        text-transform: uppercase; color: #7a3a3a;
        border-top: 1.5px solid #f0d5d0;
        padding-top: 22px; margin: 28px 0 22px;
      }

      .pf-save-btn {
        background: linear-gradient(135deg, #e8857a, #c96b60);
        color: #fff; border: none; padding: 13px 40px;
        border-radius: 50px; font-family: 'Quicksand', sans-serif;
        font-weight: 700; font-size: 0.95rem; cursor: pointer;
        letter-spacing: 0.05em; margin-top: 10px;
        transition: transform 0.2s, box-shadow 0.2s; display: block;
      }
      .pf-save-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(232,133,122,0.36);
      }

      .pf-ok  { background:#fff0ee; border:1px solid #e8857a; color:#8b2020; padding:12px 18px; border-radius:10px; font-size:0.87rem; font-weight:600; margin-bottom:22px; }
      .pf-err { background:#fff5f5; border:1px solid #f5c2c7; color:#842029; padding:12px 18px; border-radius:10px; font-size:0.87rem; margin-bottom:22px; }

      /* orders */
      .pf-table { width:100%; border-collapse:collapse; font-size:0.87rem; font-family:'Quicksand',sans-serif; }
      .pf-table th { text-align:left; padding:10px 14px; background:#fff3f1; color:#7a3a3a; font-weight:700; font-size:0.7rem; letter-spacing:0.08em; text-transform:uppercase; border-bottom:2px solid #f0d5d0; }
      .pf-table td { padding:14px; border-bottom:1px solid #fde8e8; color:#4a2020; vertical-align:middle; }
      .pf-table tr:hover td { background:#fff8f7; }

      .pf-badge { display:inline-block; padding:3px 12px; border-radius:20px; font-size:0.74rem; font-weight:700; }
      .pf-badge-p { background:#fff3cd; color:#856404; }
      .pf-badge-d { background:#d1e7dd; color:#0f5132; }

      .pf-empty { text-align:center; padding:60px 20px; color:#a07070; font-family:'Quicksand',sans-serif; }
      .pf-empty strong { display:block; font-size:1rem; color:#7a3a3a; margin-bottom:8px; }

      .pf-shop-link {
        display:inline-block; margin-top:18px;
        background:linear-gradient(135deg,#e8857a,#c96b60);
        color:#fff; padding:10px 30px; border-radius:24px;
        font-weight:700; text-decoration:none; font-size:0.87rem;
        transition:transform 0.2s,box-shadow 0.2s;
      }
      .pf-shop-link:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(232,133,122,0.35); color:#fff; }

      @media(max-width:820px){
        .pf-body { grid-template-columns:1fr; }
        .pf-hero { padding:32px 24px 26px; }
        .pf-card { padding:28px 22px; }
        .pf-form-row { grid-template-columns:1fr; }
        .pf-sidebar { position:static; }
      }
    `}</style>

    <div className="pf-page">
      {/* Banner */}
      <div className="pf-hero">
        <h1>My Account</h1>
        <p className="pf-hero-sub">Manage your profile, orders &amp; preferences</p>
      </div>

      <div className="pf-body">
        {/* Sidebar */}
        <aside className="pf-sidebar">
          <div className="pf-user-badge">
            <div className="pf-avatar">{(customer?.name||'U')[0].toUpperCase()}</div>
            <div>
              <div className="pf-user-name">{customer?.name || 'Guest'}</div>
              <div className="pf-user-id">{customer?._id}</div>
            </div>
          </div>

          <ul className="pf-nav">
            {navItems.map(item => (
              <li key={item.key}>
                <button
                  className={`pf-nav-btn ${activeTab === item.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.key)}
                >{item.label}</button>
              </li>
            ))}
          </ul>
          <button className="pf-logout-btn" onClick={handleLogout}>Log Out</button>
        </aside>

        {/* Content */}
        <div className="pf-card">

          {(activeTab === 'account' || activeTab === 'password') && (
            <>
              <h2 className="pf-card-title">Account Details</h2>
              {success && <div className="pf-ok">{success}</div>}
              {error   && <div className="pf-err">{error}</div>}

              <form onSubmit={handleSave}>
                <div className="pf-form-row">
                  <div className="pf-fg">
                    <label className="pf-label">First name <span>*</span></label>
                    <input className="pf-input" type="text" value={formData.firstName}
                      onChange={e => setFormData(p=>({...p,firstName:e.target.value}))} required />
                  </div>
                  <div className="pf-fg">
                    <label className="pf-label">Last name <span>*</span></label>
                    <input className="pf-input" type="text" value={formData.lastName}
                      onChange={e => setFormData(p=>({...p,lastName:e.target.value}))} required />
                  </div>
                </div>

                <div className="pf-fg">
                  <label className="pf-label">Display name <span>*</span></label>
                  <input className="pf-input" type="text" value={formData.displayName}
                    onChange={e => setFormData(p=>({...p,displayName:e.target.value}))} required />
                  <span className="pf-hint">This will be how your name is displayed in the account section and in reviews.</span>
                </div>

                <div className="pf-fg">
                  <label className="pf-label">Email address <span>*</span></label>
                  <input className="pf-input" type="email" value={formData.email}
                    onChange={e => setFormData(p=>({...p,email:e.target.value}))} required />
                </div>

                <div className="pf-section-sep">Password Change</div>

                <div className="pf-fg">
                  <label className="pf-label" style={{textTransform:'none',letterSpacing:0,fontWeight:600}}>
                    Current password &nbsp;<em style={{fontWeight:400,color:'#a07070',fontStyle:'italic'}}>(leave blank to leave unchanged)</em>
                  </label>
                  <input className="pf-input" type="password" value={formData.currentPassword}
                    onChange={e => setFormData(p=>({...p,currentPassword:e.target.value}))} />
                </div>

                <div className="pf-fg">
                  <label className="pf-label" style={{textTransform:'none',letterSpacing:0,fontWeight:600}}>
                    New password &nbsp;<em style={{fontWeight:400,color:'#a07070',fontStyle:'italic'}}>(leave blank to leave unchanged)</em>
                  </label>
                  <input className="pf-input" type="password" value={formData.newPassword}
                    onChange={e => setFormData(p=>({...p,newPassword:e.target.value}))} />
                </div>

                <div className="pf-fg">
                  <label className="pf-label">Confirm new password</label>
                  <input className="pf-input" type="password" value={formData.confirmNewPassword}
                    onChange={e => setFormData(p=>({...p,confirmNewPassword:e.target.value}))} />
                </div>

                <button type="submit" className="pf-save-btn">Save Changes</button>
              </form>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <h2 className="pf-card-title">My Orders</h2>
              {orders.length === 0 ? (
                <div className="pf-empty">
                  <strong>No orders yet</strong>
                  Start shopping to see your orders here.
                  <br />
                  <Link to="/cakes" className="pf-shop-link">Shop Now</Link>
                </div>
              ) : (
                <table className="pf-table">
                  <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td style={{fontWeight:700,color:'#e8857a'}}>#{o._id}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td><span className={`pf-badge ${o.isDelivered?'pf-badge-d':'pf-badge-p'}`}>{o.isDelivered?'Delivered':'Processing'}</span></td>
                        <td style={{fontWeight:600}}>Rs. {o.totalPrice?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === 'addresses' && (
            <>
              <h2 className="pf-card-title">Addresses</h2>
              <div className="pf-empty">
                <strong>No saved addresses</strong>
                Your saved delivery addresses will appear here.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CustomerProfile;

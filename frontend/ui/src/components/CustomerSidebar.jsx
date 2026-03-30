// // import React, { useState, useEffect } from 'react'
// // import { Link, useNavigate } from 'react-router-dom';
// // import "./CustomerSidebar.css" 

// // const CustomerProfile = ({ customer, setCustomer }) => {
// //   const navigate = useNavigate();
// //   const [activeTab, setActiveTab] = useState('account');
// //   const [orders, setOrders] = useState([]);
// //   const [formData, setFormData] = useState({
// //     firstName:'', lastName:'', displayName:'',
// //     email:'', currentPassword:'', newPassword:'', confirmNewPassword:''
// //   });
// //   const [success, setSuccess] = useState('');
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     if (customer) {
// //       const parts = (customer.name || '').split(' ');
// //       setFormData(p => ({
// //         ...p,
// //         firstName: parts[0] || '',
// //         lastName: parts.slice(1).join(' ') || '',
// //         displayName: customer.name || '',
// //         email: customer.email || ''
// //       }));
// //     }
// //   }, [customer]);

// //   useEffect(() => {
// //     if (activeTab === 'orders') {
// //       api.get('/api/orders/my-orders').then(r => setOrders(r.data)).catch(() => setOrders([]));
// //     }
// //   }, [activeTab]);

// //   const handleLogout = () => {
// //     localStorage.removeItem('customerToken');
// //     setCustomer(null);
// //     navigate('/');
// //   };

// //   const handleSave = async (e) => {
// //     e.preventDefault();
// //     setError(''); setSuccess('');
// //     if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
// //       setError('New passwords do not match.'); return;
// //     }
// //     try {
// //       await api.put('/api/auth/customer/update', {
// //         name: `${formData.firstName} ${formData.lastName}`.trim(),
// //         email: formData.email,
// //         ...(formData.newPassword && { currentPassword: formData.currentPassword, newPassword: formData.newPassword })
// //       });
// //       setSuccess('Account details saved!');
// //       setFormData(p => ({ ...p, currentPassword:'', newPassword:'', confirmNewPassword:'' }));
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Failed to update account.');
// //     }
// //   };

// //   const navItems = [
// //     { key: 'account',   label: 'Account details' },
// //     { key: 'orders',    label: 'Orders' },
// //     { key: 'addresses', label: 'Addresses' },
// //     { key: 'password',  label: 'Lost password' },
// //   ];

// // return(
  
// // <aside className="pf-sidebar">
// //           <div className="pf-user-badge">
// //             <div className="pf-avatar">{(customer?.name||'U')[0].toUpperCase()}</div>
// //             <div>
// //               <div className="pf-user-name">{customer?.name || 'Guest'}</div>
// //               <div className="pf-user-id">{customer?._id}</div>
// //             </div>
// //           </div>

// //           <ul className="pf-nav">
// //             {navItems.map(item => (
// //               <li key={item.key}>
// //                 <button
// //                   className={`pf-nav-btn ${activeTab === item.key ? 'active' : ''}`}
// //                   onClick={() => setActiveTab(item.key)}
// //                 >{item.label}</button>
// //               </li>
// //             ))}
// //           </ul>
// //           <button className="pf-logout-btn" onClick={handleLogout}>Log Out</button>
// //         </aside>

// // );
// // };
// // export default CustomerSidebar;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './CustomerSidebar.css';

// const CustomerSidebar = ({ customer, setCustomer, activeTab, setActiveTab }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('customerToken');
//     setCustomer(null);
//     navigate('/');
//   };

//   const navItems = [
//     { key: 'account',    label: 'Account details' },
//     { key: 'orders',     label: 'Orders' },
//     { key: 'customizes', label: 'My Custom Cakes' },
//     { key: 'reviews',    label: 'My Reviews' },
//     { key: 'addresses',  label: 'Addresses' },
//     { key: 'password',   label: 'Lost password' },
//   ];

//   return (
//     <aside className="pf-sidebar">
//       <div className="pf-user-badge">
//         <div className="pf-avatar">{(customer?.name || 'U')[0].toUpperCase()}</div>
//         <div>
//           <div className="pf-user-name">{customer?.name || 'Guest'}</div>
//           <div className="pf-user-id">{customer?._id}</div>
//         </div>
//       </div>

//       <ul className="pf-nav">
//         {navItems.map(item => (
//           <li key={item.key}>
//             <button
//               className={`pf-nav-btn ${activeTab === item.key ? 'active' : ''}`}
//               onClick={() => setActiveTab(item.key)}
//             >
//               {item.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//       <button className="pf-logout-btn" onClick={handleLogout}>Log Out</button>
//     </aside>
//   );
// };

// export default CustomerSidebar;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerSidebar.css';

const CustomerSidebar = ({ customer, setCustomer, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    setCustomer(null);
    navigate('/');
  };

  const navItems = [
    { key: 'account',    label: 'Account details' },
    { key: 'orders',     label: 'Orders' },
    { key: 'customizes', label: 'My Custom Cakes' },
    { key: 'reviews',    label: 'My Reviews' },
    { key: 'addresses',  label: 'Addresses' },
    { key: 'password',   label: 'Lost password' },
  ];

  return (
    <aside className="pf-sidebar">
      <div className="pf-user-badge">
        <div className="pf-avatar">{(customer?.name || 'U')[0].toUpperCase()}</div>
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
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <button className="pf-logout-btn" onClick={handleLogout}>Log Out</button>
    </aside>
  );
};

export default CustomerSidebar;

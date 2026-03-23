import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/* All styles are scoped inside this component via a <style> tag */

const AdminSidebar = ({ staff }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const role = staff?.role || localStorage.getItem('staffRole') || 'staff';
  const isAdmin = ['admin', 'firstlevelAdmin', 'manager'].includes(role);
  const isFirstLevel = role === 'firstlevelAdmin';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('staffToken');
      localStorage.removeItem('staffRole');
      localStorage.removeItem('staffData');
      navigate('/staff/login');
    }
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Menu items — role-gated
  const menuItems = [
    {
      icon: '📊', label: 'Dashboard', path: '/staff/dashboard',
      roles: ['admin', 'firstlevelAdmin', 'manager', 'baker', 'delivery staff']
    },
    {
      icon: '📦', label: 'Orders', path: '/staff/orders',
      roles: ['admin', 'firstlevelAdmin', 'manager', 'baker', 'delivery staff']
    },
    {
      icon: '✅', label: 'Completed Orders', path: '/staff/completed-orders',
      roles: ['admin', 'firstlevelAdmin', 'manager']
    },
    {
      icon: '🎂', label: 'Products', path: '/staff/manage-products',
      roles: ['admin', 'firstlevelAdmin', 'manager']
    },
    {
      icon: '🎨', label: 'Custom Cakes', path: '/staff/customizes',
      roles: ['admin', 'firstlevelAdmin', 'manager', 'baker']
    },
    {
      icon: '🏭', label: 'Inventory', path: '/staff/inventory',
      roles: ['admin', 'firstlevelAdmin', 'manager']
    },
    {
      icon: '⚙️', label: 'Options', path: '/staff/options',
      roles: ['admin', 'firstlevelAdmin', 'manager']
    },
    {
      icon: '👥', label: 'Staff', path: '/staff/manage-staff',
      roles: ['admin', 'firstlevelAdmin']
    },
    {
      icon: '🔑', label: 'Roles', path: '/staff/roles',
      roles: ['firstlevelAdmin']
    },
    {
      icon: '⭐', label: 'Reviews', path: '/staff/reviews',
      roles: ['admin', 'firstlevelAdmin', 'manager']
    },
    {
      icon: '👤', label: 'Profile', path: '/staff/profile',
      roles: ['admin', 'firstlevelAdmin', 'manager', 'baker', 'delivery staff']
    },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,600&display=swap');

        .staff-sidebar {
          width: ${collapsed ? '72px' : '240px'};
          min-height: 100vh;
          background: #fff;
          border-right: 1px solid #f5dede;
          display: flex;
          flex-direction: column;
          transition: width 0.28s ease;
          font-family: 'Quicksand', sans-serif;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        /* Brand header */
        .ss-header {
          padding: ${collapsed ? '20px 0' : '22px 20px 18px'};
          border-bottom: 1px solid #f5dede;
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? 'center' : 'space-between'};
          gap: 10px;
        }

        .ss-brand {
          display: ${collapsed ? 'none' : 'block'};
        }
        .ss-brand-name {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.25rem;
          color: #c85050;
          line-height: 1;
          margin: 0 0 3px;
        }
        .ss-brand-sub {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b08080;
        }

        .ss-collapse-btn {
          background: #fdf0f0;
          border: none;
          border-radius: 8px;
          width: 30px; height: 30px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
          color: #c85050;
          transition: background 0.2s;
          flex-shrink: 0;
          padding: 0 !important;
          width: 30px !important;
        }
        .ss-collapse-btn:hover { background: #fde0e0; }

        /* Role badge */
        .ss-role-badge {
          display: ${collapsed ? 'none' : 'block'};
          margin: 14px 16px 6px;
          background: linear-gradient(135deg, #fde8e8, #fdf0f0);
          border: 1px solid #f5dede;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .ss-staff-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: #3d1818;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ss-staff-role {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #c85050;
        }

        /* Nav */
        .ss-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
          list-style: none;
          margin: 0;
          scrollbar-width: thin;
          scrollbar-color: #f5dede transparent;
        }

        .ss-nav-item { margin: 2px 8px; }

        .ss-nav-link {
          display: flex;
          align-items: center;
          gap: ${collapsed ? '0' : '12px'};
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          padding: ${collapsed ? '10px 0' : '10px 14px'};
          border-radius: 10px;
          text-decoration: none !important;
          color: #7a3a3a;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: 'Quicksand', sans-serif;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
          overflow: hidden;
        }
        .ss-nav-link:hover { background: #fdf0f0; color: #c85050; }
        .ss-nav-link.active { background: #fde8e8; color: #c85050; font-weight: 700; }

        .ss-nav-icon { font-size: 1.1rem; flex-shrink: 0; line-height: 1; }
        .ss-nav-label { display: ${collapsed ? 'none' : 'block'}; }

        /* Divider */
        .ss-divider {
          height: 1px;
          background: #f5dede;
          margin: 8px 16px;
        }

        /* Logout */
        .ss-logout {
          padding: 14px 8px 18px;
          border-top: 1px solid #f5dede;
        }
        .ss-logout-btn {
          display: flex;
          align-items: center;
          gap: ${collapsed ? '0' : '12px'};
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          width: 100%;
          padding: ${collapsed ? '10px 0' : '10px 14px'};
          border-radius: 10px;
          background: none !important;
          border: none !important;
          color: #b08080;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: 'Quicksand', sans-serif;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
          overflow: hidden;
          width: 100% !important;
          box-shadow: none !important;
        }
        .ss-logout-btn:hover { background: #fdf0f0 !important; color: #c85050 !important; transform: none !important; }
      `}</style>

      <div className="staff-sidebar">
        {/* Header */}
        <div className="ss-header">
          <div className="ss-brand">
            <div className="ss-brand-name">Chara Cakes</div>
            <div className="ss-brand-sub">Management</div>
          </div>
          <button className="ss-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Role badge */}
        <div className="ss-role-badge">
          <div className="ss-staff-name">
            {staff?.name || JSON.parse(localStorage.getItem('staffData') || '{}')?.name || 'Staff Member'}
          </div>
          <div className="ss-staff-role">{role}</div>
        </div>

        {/* Nav items */}
        <ul className="ss-nav">
          {visibleItems.map((item, i) => (
            <li key={i} className="ss-nav-item">
              <Link
                to={item.path}
                className={`ss-nav-link ${isActive(item.path) ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="ss-nav-icon">{item.icon}</span>
                <span className="ss-nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="ss-logout">
          <button className="ss-logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
            <span className="ss-nav-icon">🚪</span>
            <span className="ss-nav-label">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

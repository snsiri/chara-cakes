import { useEffect, useState } from 'react';
import api from './api/axios';
import './App.css';
import Navbar from './components/Navbar';
import Cakes from './components/Cakes';
import Home from './components/Home';
import InsertProduct from './components/InsertProduct';
import Cart from './components/Cart';
import CustomizeItem from './components/CustomizeItem';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import ProductManagerPage from './components/ProductManagerPage';
import DiscontinuedProducts from './components/DiscontinuedProducts';
import Search from './components/Search';
import CakeDetails from './components/CakeDetails';
import InsertOption from './components/InsertOption';
import UpdateOption from './components/UpdateOption';
import UpdateCustomize from './components/UpdateCustomize';
import OrderTable from './components/OrderTable';
import OrderDetails from './components/OrderDetails';
import CompletedOrdersPage from './components/CompletedOrdersPage';
import CustomizeDetails from './components/CustomizeDetails';
import ViewCustomize from './components/ViewCustomize';
import AdminDashboard from './components/AdminDashboard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomerLogin from './components/CustomerLogin';
import CustomerRegister from './components/CustomerRegistration';
import NotFound from './components/NotFound';
import CustomerProfile from './components/CustomerProfile';

// Staff components
import StaffLogin from './components/StaffLogin';
import AdminSidebar from './components/AdminSidebar';

/* ── Protected route wrapper ── */
const ProtectedRoute = ({ isAllowed, children, redirectTo = '/login' }) => {
  if (!isAllowed) return <Navigate to={redirectTo} replace />;
  return children;
};

/* ── Staff protected route ── */
const StaffRoute = ({ children }) => {
  const token = localStorage.getItem('staffToken');
  if (!token) return <Navigate to="/staff/login" replace />;
  return children;
};

/* ── Wrapper that hides Navbar on /staff/* routes ── */
const AppLayout = ({ customer, setCustomer, staff, setStaff }) => {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="app-container">
      {!isStaffRoute && <Navbar customer={customer} setCustomer={setCustomer} />}
      <main className={isStaffRoute ? '' : 'main-content'}>
        <Routes>
          {/* ══ PUBLIC CUSTOMER ROUTES ══ */}
          <Route path="/" element={<Home customer={customer} />} />
          <Route path="/login" element={customer ? <Navigate to="/" /> : <CustomerLogin setCustomer={setCustomer} />} />
          <Route path="/register" element={customer ? <Navigate to="/login" /> : <CustomerRegister setCustomer={setCustomer} />} />
          <Route path="/cakes" element={<Cakes />} />
          <Route path="/cakes/:id" element={<CakeDetails />} />
          <Route path="/customizes" element={<CustomizeItem />} />
          <Route path="/search" element={<Search />} />

          {/* ══ PROTECTED CUSTOMER ROUTES ══ */}
          <Route path="/cart" element={
            <ProtectedRoute isAllowed={!!customer}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/customerProfile" element={
            <ProtectedRoute isAllowed={!!customer}>
              <CustomerProfile customer={customer} setCustomer={setCustomer} />
            </ProtectedRoute>
          } />

          {/* ══ STAFF ROUTES ══ */}
          <Route path="/staff/login" element={
            localStorage.getItem('staffToken')
              ? <Navigate to="/staff/dashboard" />
              : <StaffLogin setStaff={setStaff} />
          } />

          {/* All /staff/* pages go through StaffRoute guard */}
          <Route path="/staff/*" element={
            <StaffRoute>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard staff={staff} />} />
                <Route path="orders" element={<OrderTable staff={staff} />} />
                <Route path="completed-orders" element={<CompletedOrdersPage staff={staff} />} />
                <Route path="manage-products" element={<ProductManagerPage staff={staff} />} />
                <Route path="discontinued" element={<DiscontinuedProducts />} />
                <Route path="insert_product" element={<InsertProduct />} />
                <Route path="customizes" element={<CustomizeDetails />} />
                <Route path="customize-details/:id" element={<ViewCustomize />} />
                <Route path="options" element={<UpdateOption />} />
                <Route path="insert-option" element={<InsertOption />} />
                <Route path="customize-manage" element={<UpdateCustomize />} />
                <Route path="inventory" element={<AdminDashboard staff={staff} />} />
                <Route path="reviews" element={<AdminDashboard staff={staff} />} />
                <Route path="profile" element={<AdminDashboard staff={staff} />} />
                {/* Redirect /staff/ root to dashboard */}
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StaffRoute>
          } />

          {/* Legacy /admin/* redirect → /staff/* */}
          <Route path="/admin" element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="/admin/*" element={<Navigate to="/staff/dashboard" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

/* ══════════════════════════════════════ */
function App() {
  const [customer, setCustomer] = useState(null);
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore customer session
    const fetchCustomer = async () => {
      const token = localStorage.getItem('customerToken');
      if (token) {
        try {
          const res = await api.get('/api/auth/customer/me');
          setCustomer(res.data.customer || res.data);
        } catch {
          localStorage.removeItem('customerToken');
        }
      }
      setIsLoading(false);
    };

    // Restore staff session from localStorage
    const savedStaff = localStorage.getItem('staffData');
    if (savedStaff) {
      try { setStaff(JSON.parse(savedStaff)); } catch { /* ignore */ }
    }

    fetchCustomer();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: 'Quicksand, sans-serif',
        color: '#c85050', fontSize: '1rem', fontWeight: 600
      }}>
        Loading…
      </div>
    );
  }

  return (
    <Router>
      <AppLayout
        customer={customer} setCustomer={setCustomer}
        staff={staff} setStaff={setStaff}
      />
    </Router>
  );
}

export default App;

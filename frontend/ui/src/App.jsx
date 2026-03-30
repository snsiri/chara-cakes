// import { useEffect,useState } from 'react';
// import api from './api/axios';
// import './App.css';
// import Navbar from './components/Navbar';
// import Cakes from './components/Cakes';
// import Home from './components/Home';
// import InsertProduct from './components/InsertProduct';
// import Cart from './components/Cart';
// import CustomizeItem from './components/CustomizeItem';
// import { BrowserRouter as Router, Routes, Route, UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";
// import { Navigate } from 'react-router-dom';
// import UpdateCakes from './components/UpdateCakes';
// // import UpdateForm from './components/UpdateForm';
// import ProductManagerPage from './components/ProductManagerPage';
// // import UpdateCakePage from './components/UpdateCakePage';
// import DiscontinuedProducts from './components/DiscontinuedProducts';
// import Footer from './components/Footer';
// import Search from './components/Search';
// import CakeDetails from './components/CakeDetails';
// import InsertOption from './components/InsertOption';
// import UpdateOption from './components/UpdateOption';
// import UpdateCustomize from './components/UpdateCustomize';
// import OrderTable from './components/OrderTable';
// import OrderDetails from './components/OrderDetails';
// import CompletedOrdersPage from './components/CompletedOrdersPage';
// import CustomizeDetails from './components/CustomizeDetails';
// import ViewCustomize from './components/ViewCustomize';
// import AdminDashboard from './components/AdminDashboard';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import Content from './components/Content';
// import AdminSidebar from './components/AdminSidebar';    
// import CustomerLogin from './components/CustomerLogin';
// import CustomerRegister from './components/CustomerRegistration'; 
// import NotFound from './components/NotFound'     
// import CustomerProfile from './components/CustomerProfile';
// import CustomerSidebar from './components/CustomerSidebar';  

// function App() {
//   const [customer, setCustomer] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] =useState(true);
  
//   const ProtectedRoute = ({ isAllowed, children, redirectTo = "/login" }) => {
//   if (!isAllowed) {
//     return <Navigate to={redirectTo} replace />;
//   }
//   return children;
// };

//   useEffect(() => {
//     const fetchCustomer = async () => {
//       const token = localStorage.getItem('customerToken');
//       if (token) {
//         try {
//           const res= await api.get("/api/auth/customer/me");
//           setCustomer(res.data.customer);
//         } catch (err) {
//           setError('Failed to fetch customer data');
//           localStorage.removeItem('customerToken');
//         }
//       }
//       setIsLoading(false);
//     };
//     fetchCustomer();
//   }, []); 

//   if(isLoading) {
//     return (
//       <div>
//         Loading...
//       </div>
//     )
//   }


//   return (
//     <Router>
//       <div className="app-container">
//         <Navbar customer={customer} setCustomer={setCustomer}/>
//         <main className="main-content">
//           <Routes>
//             {/* <Route path="/login" element={customer ? <Navigate to="/"/>:<CustomerLogin setCustomer={setCustomer} />} />
//             <Route path ="/register" element={customer ? <Navigate to="/"/>:<CustomerRegister setCustomer={setCustomer} />} />
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/admin/sidebar" element={<AdminSidebar />} />
//             <Route path="/" element={<Home customer={customer} error={error}/>} />
//             <Route path="/cakes" element={<Cakes />} />
//             <Route path="/cart" element={customer ? <Cart /> : <Navigate to="/login"  />} />
//             <Route path="/admin/orders" element={<OrderTable />} />
//             <Route path="/admin/customize-details/:id" element={<ViewCustomize />} />
//             <Route path="/admin/customizes1" element={<CustomizeDetails />} />
            
//             <Route path="/admin/discontinued" element={<DiscontinuedProducts />} />
//             <Route path="/order/:orderId" element={<OrderDetails />} />
//             <Route path="/customizes" element={<CustomizeItem />} />
//             <Route path="/admin/insert_product" element={<InsertProduct />} />
//             <Route path="/update" element={<UpdateCakes />} />
            
//             <Route path="/admin/manage-products" element={<ProductManagerPage />} />
//             <Route path="/updatecustomize" element={<UpdateCustomize />} />
//             <Route path="/search" element={<Search />} />
//             <Route path="/cakes/:id" element={<CakeDetails />} />
//             <Route path="/admin/insert-option" element={<InsertOption />} />
//             <Route path="/admin/update-option" element={<UpdateOption />} />
//             <Route path="/admin/completed-orders" element={<CompletedOrdersPage />} />
//             <Route path="/customerProfile" element={customer ? <CustomerProfile customer={customer} setCustomer={setCustomer} /> : <Navigate to="/" />} />
//             <Route path="/customer/sidebar" element={<CustomerSidebar customer={customer} setCustomer={setCustomer} />} />
//             <Route path="*" element={<NotFound/>}/> */}
//             {/* Public Routes */}
//   <Route path="/" element={<Home customer={customer} error={error}/>} />
//   <Route path="/login" element={customer ? <Navigate to="/"/> : <CustomerLogin setCustomer={setCustomer} />} />
//   <Route path="/register" element={customer ? <Navigate to="/login"/> : <CustomerRegister setCustomer={setCustomer} />} />
//   <Route path="/cakes" element={<Cakes />} />
//   <Route path="/customizes" element={<CustomizeItem setCustomer={setCustomer} />} />
//   <Route path="/cakes/:id" element={<CakeDetails />} />
//   <Route path="/search" element={<Search />} />

//   {/* Customer Only Routes */}
//   <Route path="/cart" element={
//     <ProtectedRoute isAllowed={!!customer}>
//       <Cart />
//     </ProtectedRoute>
//   } />
//   <Route path="/customerProfile" element={
//     <ProtectedRoute isAllowed={!!customer}>
//       <CustomerProfile customer={customer} setCustomer={setCustomer} />
//     </ProtectedRoute>
//   } />

//   {/* Admin Only Routes - Protecting the entire block */}
//   <Route path="/admin/*" element={
//     // <ProtectedRoute isAllowed={customer?.role === 'admin'} redirectTo="/">
//        <Routes>
//           <Route path="/" element={<AdminDashboard />} />
//           <Route path="orders" element={<OrderTable />} />
//           <Route path="completed-orders" element={<CompletedOrdersPage />} />
//           <Route path="manage-products" element={<ProductManagerPage />} />
//           <Route path="discontinued" element={<DiscontinuedProducts />} />
//           <Route path="insert_product" element={<InsertProduct />} />
//           {/* ... other admin sub-routes */}
//        </Routes>
//     // </ProtectedRoute>
//   } />

//   <Route path="*" element={<NotFound/>}/>
//           </Routes>
//         </main>
      
//       </div>
//     </Router>
//   );
// }

// export default App;

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
import AboutUs from './components/Aboutus';
import ContactUs from './components/Contactus';
import Footer from './components/Footer';

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
          <Route path="/customizes" element={customer ? <CustomizeItem /> : <Navigate to="/login" />} />          
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

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
      <Footer/>
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


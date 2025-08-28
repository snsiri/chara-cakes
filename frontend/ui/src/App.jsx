import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Cakes from './components/Cakes';
import Home from './components/Home';
import InsertProduct from './components/InsertProduct';
import Cart from './components/Cart';
import CustomizeItem from './components/CustomizeItem';
import { BrowserRouter as Router, Routes, Route, UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";
import UpdateCakes from './components/UpdateCakes';
// import UpdateForm from './components/UpdateForm';
import ProductManagerPage from './components/ProductManagerPage';
// import UpdateCakePage from './components/UpdateCakePage';
import DiscontinuedProducts from './components/DiscontinuedProducts';
import Footer from './components/Footer';
import Search from './components/Search';
import CakeDetails from './components/CakeDetails';
import InsertOption from './components/InsertOption';
import UpdateOption from './components/UpdateOption';
import UpdateCustomize from './components/UpdateCustomize';
import OderTable from './components/OrderTable';
import OrderDetails from './components/OrderDetails';
import CompletedOrdersPage from './components/CompletedOrdersPage';
import CustomizeDetails from './components/CustomizeDetails';
import ViewCustomize from './components/ViewCustomize';
import AdminDashboard from './components/adminDashboard';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Content from './components/Content';
import Sidebar from './components/Sidebar';            

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/admin/Content" element={<Content />} />
             <Route path="/admin/Sidebar" element={<Sidebar />} />
            <Route path="/" element={<Home />} />
            <Route path="/cakes" element={<Cakes />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin/ordertable" element={<OderTable />} />
            <Route path="/admin/customize-details/:id" element={<ViewCustomize />} />
            <Route path="/admin/customizes1" element={<CustomizeDetails />} />
            {/* <Route path="/admin/update-cake" element={<UpdateCakePage />} /> */}
            <Route path="/admin/discontinued" element={<DiscontinuedProducts />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/customizes" element={<CustomizeItem />} />
            <Route path="/admin/insert_product" element={<InsertProduct />} />
            <Route path="/update" element={<UpdateCakes />} />
            {/* <Route path="/admin/update-form" element={<UpdateForm />} /> */}
            <Route path="/admin/manage-products" element={<ProductManagerPage />} />
            <Route path="/updatecustomize" element={<UpdateCustomize />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cakes/:id" element={<CakeDetails />} />
            <Route path="/admin/insert-option" element={<InsertOption />} />
            <Route path="/admin/update-option" element={<UpdateOption />} />
            <Route path="/admin/completed-orders" element={<CompletedOrdersPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


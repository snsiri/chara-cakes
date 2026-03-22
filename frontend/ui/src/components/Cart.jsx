import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';


const Cart = () => {
  const [cart, setCart] = useState({ product: [], customize: [] });
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCustomizes, setSelectedCustomizes] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(''); // New state for delivery date
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cart');
      if (res.data.status === 'Success') {
        setCart(res.data.data);
      } else {
        setError('Failed to fetch cart');
      }
    } catch (err) {
      setError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleCustomizeSelect = (id) => {
    setSelectedCustomizes((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length + selectedCustomizes.length === cart.product.length + cart.customize.length) {
      setSelectedProducts([]);
      setSelectedCustomizes([]);
    } else {
      setSelectedProducts(cart.product.map((item) => item._id));
      setSelectedCustomizes(cart.customize.map((item) => item._id));
    }
  };

  const handleQuantityChange = async (type, id, action) => {
    setLoading(true);
    try {
      await api.post(`/api/cart/${action}`, { type, id });
      fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
      setLoading(false);
    }
  };

  const handleRemove = async (type, id) => {
    setLoading(true);
    try {
      if (type === 'product') {
        await api.delete(`/api/cart/remove-product/${id}`);
      } else {
        await api.delete(`/api/cart/remove-customize/${id}`);
      }
      fetchCart();
    } catch (err) {
      setError('Failed to remove item');
      setLoading(false);
    }
  };

  const token = localStorage.getItem('customerToken');
    if (!token) {
      setError('Please login to add items to your cart.');
      return;
    }

  const handleCheckout = async () => {
    if (!deliveryDate) {
      setError('Please select a delivery date.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Calculate totals for selected items
      const productsToOrder = cart.product.filter((item) => selectedProducts.includes(item._id));
      const customizesToOrder = cart.customize.filter((item) => selectedCustomizes.includes(item._id));
      const itemsPrice =
        productsToOrder.reduce((sum, item) => sum + Number(item.product_price) * item.quantity, 0) +
        customizesToOrder.reduce((sum, item) => sum + Number(item.custom_price) * item.quantity, 0);
      const deliveryfee = 0; // Set your delivery fee logic here
      const taxPrice = 0; // Set your tax logic here
      const totalPrice = itemsPrice + deliveryfee + taxPrice;

      const res = await api.post('/api/orders/add', {
        selectedProducts,
        selectedCustomizes,
        deliveryAddress: {
          address: '123 Main St', // Replace with actual address
          city: 'Metropolis',
          postalCode: '12345',
        },
        paymentMethod: 'card', // Replace with actual method
        itemsPrice,
        deliveryfee,
        taxPrice,
        totalPrice,
        deliveryDate, // Include the delivery date
      });

      if (res.data.status === 'Order placed successfully.') {
        setSelectedProducts([]);
        setSelectedCustomizes([]);
        fetchCart();
        navigate(`/cakes`); // Redirect to order details page
      } else {
        setError('Checkout failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Checkout failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
const selectedProductTotal = cart.product
  .filter((item) => selectedProducts.includes(item._id))
  .reduce((sum, item) => sum + Number(item.product_price) * item.quantity, 0);

const selectedCustomizeTotal = cart.customize
  .filter((item) => selectedCustomizes.includes(item._id))
  .reduce((sum, item) => sum + Number(item.custom_price) * item.quantity, 0);

const total = selectedProductTotal + selectedCustomizeTotal;
// const cakeTotal = Number(item.product_price) * quantity;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <Link to="/" className="breadcrumb">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">Cart</span>
      </div>

      

      {/* Cart items section */}
      <div className="cart-content">
        <div className="cart-items">
          <div className="select-all-header">
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span>Select all ({cart.product.length + cart.customize.length})</span>
            </label>
            
          </div>

          {/* Product items */}
          {cart.product.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="item-checkbox">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(item._id)}
                  onChange={() => handleProductSelect(item._id)}
                />
              </div>
              <div className="item-details">
                <h3>{item.product_name}</h3>
                {item.product_image ? (
                 
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="cart-item-image"
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                  />) : (
                  <div className="no-image">No Image Available</div>
                )}
               
                <div className="item-pricing">
                  <div className="price">
                    <span className="current-price">Rs. {Number(item.product_price).toFixed(2)}</span> <br/>
                    <span className="multi-price">Rs. {Number(item.product_price) * item.quantity}.00</span>
                  </div>
                  <div className="quantity-selector">
                    <button disabled={loading} onClick={() => handleQuantityChange('product', item._id, 'decrease')}>-</button>
                    <span>{item.quantity}</span>
                    <button disabled={loading} onClick={() => handleQuantityChange('product', item._id, 'increase')}>+</button>
                  
                  <button className="remove-btn" disabled={loading} onClick={() => handleRemove('product', item._id)}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Customize items */}
          {cart.customize.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="item-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCustomizes.includes(item._id)}
                  onChange={() => handleCustomizeSelect(item._id)}
                />
              </div>
              <div className="item-details">
                <h3>Custom Cake ({item._id})</h3>
                {item.custom_ingredients && item.custom_ingredients.length > 0 && (
                  <ul className="cart-ingredients-list">
                    {item.custom_ingredients.map((ing) => (
                      <li key={ing._id}>{ing.name} ({ing.quantity} {ing.unit})</li>
                    ))}
                  </ul>
                )}
                <div className="item-pricing">
                  <div className="price">
                    <span className="current-price">Rs.{Number(item.custom_price).toFixed(2)}</span>
                  </div>
                  <div className="quantity-selector">
                    <button  disabled={loading} onClick={() => handleQuantityChange('customize', item._id, 'decrease')}>-</button>
                    <span>{item.quantity}</span>
                    <button  disabled={loading} onClick={() => handleQuantityChange('customize', item._id, 'increase')}>+</button>
                  </div>
                  <button className="remove-btn" disabled={loading} onClick={() => handleRemove('customize', item._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Selected item total:</span>

            <span>Rs. {total.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
          <p className="payment-note">Please refer to your final actual payment amount.</p>

          {/* Delivery Date Input */}
          <div className="delivery-date">
            <label htmlFor="delivery-date">Delivery Date:</label>
            <input
              type="date"
              id="delivery-date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>

          <button
            className="checkout-button" 
            disabled={loading || (selectedProducts.length + selectedCustomizes.length) === 0}
            onClick={handleCheckout}
          >
            Checkout ({selectedProducts.length + selectedCustomizes.length})
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Cart;
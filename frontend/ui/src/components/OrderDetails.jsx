import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/orders/${orderId}`);
      setOrder(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details. Please try again.');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Order Details</h1>
        <Link to="/" className="breadcrumb">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/cart" className="breadcrumb">Cart</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">Order Details</span>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer ID:</strong> {order.customer_id || 'N/A'}</p>
        <p><strong>Order Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
        <p><strong>Status:</strong> {order.status || 'Pending'}</p>
        <p><strong>Delivery Status:</strong> <span className={`badge ${order.isDelivered ? 'bg-success' : 'bg-warning'}`}>
          {order.isDelivered ? 'Delivered' : 'Pending'}</span></p>
        <p><strong>Total Amount:</strong> LKR {order.totalPrice?.toFixed(2) || '0.00'}</p>
      </div>

      <div className="order-items">
        <h2>Products</h2>
        {order.product && order.product.length > 0 ? (
          order.product.map((item) => (
            <div key={item._id} className="order-item">
              <div className="item-details">
                <h3>{item.product_name}</h3>
                <p>Price: LKR {item.product_price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Added Date: {item.added_date ? new Date(item.added_date).toLocaleString() : 'N/A'}</p>
                <div className="ingredients">
                  <h4>Ingredients:</h4>
                  <ul>
                    {item.ingredients?.map((ing) => (
                      <li key={ing._id}>{ing.name}: {ing.quantity} {ing.unit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products in this order.</p>
        )}

        {order.customize && order.customize.length > 0 ? (
          order.customize.map((item) => (
            <div key={item._id} className="order-item">
              <div className="item-details">
                <h3>Custom Product</h3>
                <p>Price: LKR {item.custom_price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Added Date: {item.added_date ? new Date(item.added_date).toLocaleString() : 'N/A'}</p>
                <div className="ingredients">
                  <h4>Custom Ingredients:</h4>
                  <ul>
                    {item.custom_ingredients?.map((ing) => (
                      <li key={ing._id}>{ing.name}: {ing.quantity} {ing.unit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No customizations in this order.</p>
        )}
      </div>

      <div className="order-ingredients">
        <h2>Total Ingredients</h2>
        {order.ingredients && order.ingredients.length > 0 ? (
          <ul>
            {order.ingredients.map((ing) => (
              <li key={ing._id}>
                {ing.name}: {ing.quantity} {ing.unit}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients found for this order.</p>
        )}
      </div>

      <div className="order-total">
        <h2>Total</h2>
        <p><strong>Items Price:</strong> LKR {order.itemsPrice.toFixed(2)}</p>
        <p><strong>Delivery Fee:</strong> LKR {order.deliveryfee.toFixed(2)}</p>
        <p><strong>Tax:</strong> LKR {order.taxPrice.toFixed(2)}</p>
        <p><strong>Total Price:</strong> LKR {order.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
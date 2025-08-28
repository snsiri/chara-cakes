import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkoutData } = location.state || {};

  if (!checkoutData) {
    return (
      <div className="checkout-container">
        <h2>No checkout data found.</h2>
        <button onClick={() => navigate('/cart')} className="back-btn">
          Back to Cart
        </button>
      </div>
    );
  }

  const { products, customizes, deliveryAddress, postalCode, deliveryDate } = checkoutData;

  const totalProductAmount = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalCustomizeAmount = customizes.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = totalProductAmount + totalCustomizeAmount;

  const handlePlaceOrder = () => {
    // In a real app, you'd send data to the server here.
    alert('Order placed successfully!');
    navigate('/');
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="section">
        <h3>Delivery Details</h3>
        <p><strong>Address:</strong> {deliveryAddress}</p>
        <p><strong>Postal Code:</strong> {postalCode}</p>
        <p><strong>Delivery Date:</strong> {deliveryDate}</p>
      </div>

      <div className="section">
        <h3>Selected Products</h3>
        {products.length === 0 ? (
          <p>No products selected.</p>
        ) : (
          products.map((item) => (
            <div key={item._id} className="checkout-item">
              <img src={item.image.url} alt={item.name} className="item-image" />
              <div>
                <p><strong>{item.name}</strong></p>
                <p>Price: Rs.{item.price}.00</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: Rs.{item.price * item.quantity}.00</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>Customized Items</h3>
        {customizes.length === 0 ? (
          <p>No customized items selected.</p>
        ) : (
          customizes.map((item) => (
            <div key={item._id} className="checkout-item">
              <img src={item.image.url} alt={item.name} className="item-image" />
              <div>
                <p><strong>{item.name}</strong></p>
                <p>Type: {item.type}</p>
                <p>Size: {item.size}</p>
                <p>Weight: {item.weight}</p>
                <p>Total: Rs.{item.total}.00</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="summary">
        <p><strong>Product Total:</strong> Rs.{totalProductAmount}.00</p>
        <p><strong>Customize Total:</strong> Rs.{totalCustomizeAmount}.00</p>
        <p><strong>Grand Total:</strong> Rs.{grandTotal}.00</p>
      </div>

      <button onClick={handlePlaceOrder} className="place-order-btn">
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import './CakeDetails.css';

const CakeDetails = () => {
  const { id } = useParams(); // param name must match your route: /cake/:id
  const navigate = useNavigate();
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCakeDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/product/get/${id}`);
        setCake(res.data.Product);
      } catch (error) {
        setCake(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCakeDetails();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setSuccess('');
    setError('');
    try {
      await axios.post('http://localhost:3000/api/cart/add-product', {
        product_id: cake._id,
        quantity
      });
      setSuccess('Added to cart!');
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="cake-details-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="cake-details-container">
        <div className="error-message">
          <h2>Cake not found</h2>
          <button className="back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cake-details-container">
      <div className="cake-details-content">
        <div className="cake-image-section">
          <img src={cake.product_image || cake.image} alt={cake.product_name} className="cake-detail-image" />
        </div>
        <div className="cake-info-section">
          <h1>{cake.product_name}</h1>
          <div className="cake-price">Rs.{cake.product_price}</div>
          <div className="cake-description">
            <h3>Description</h3>
            <p>{cake.product_description}</p>
          </div>
          
          <div className="cake-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="quantity-btn"
                >-</button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >+</button>
              </div>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
          </div>
          {cake.allergens && (
            <div className="cake-allergens">
              <h3>Allergen Information</h3>
              <p>{cake.allergens}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CakeDetails; 
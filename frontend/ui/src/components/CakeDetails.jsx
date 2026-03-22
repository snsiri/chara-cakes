import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './CakeDetails.css';

const CakeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [cartError, setCartError] = useState('');

  // --- Feedback States ---
  const [feedbacks, setFeedbacks] = useState([]);
  const [isEligible, setIsEligible] = useState(false);
  const [userOrderId, setUserOrderId] = useState(''); 
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Combined all initialization into one useEffect
  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      await fetchCakeDetails();
      await fetchFeedbacks();
      await checkEligibility();
      setLoading(false);
    };
    initPage();
  }, [id]);

  const fetchCakeDetails = async () => {
    try {
      const res = await api.get(`/api/product/get/${id}`);
      setCake(res.data.Product);
    } catch (error) {
      console.error("Error fetching cake:", error);
      setCake(null);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get(`/api/feedback/product/${id}`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks");
    }
  };

  const checkEligibility = async () => {

    const token = localStorage.getItem('customerToken');
    if (!token){
      setReviewError('Please login to leave a review.');
    } return;

    try {
      const res = await api.get(`/api/feedback/verify-purchase/${id}`);

      if (res.data.eligible) {
        setIsEligible(true);
        setUserOrderId(res.data.order_id);
        setReviewError('');
      }else{
        setIsEligible(false);

        if (res.data.reason ==="Already reviewed all purchases"){
          setReviewError("You have already reviewed all your purchases of this product.");
        }else{
          setReviewError("Only customers who has purchased this product can leave a review.");
        }
      }
    } catch (err) {
      setIsEligible(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = async () => {
    setSuccess('');
    setCartError('');
    const token = localStorage.getItem('customerToken');
    if (!token) {
      setCartError('Please login to add items to your cart.');
      return;
    }

    try {
      await api.post('/api/cart/add-product', {
        product_id: cake._id,
        quantity
      });
      setSuccess('Added to cart!');
    } catch (err) {
      if (err.response?.status === 401) {
        setCartError('Your session has expired. Please login again.');
        localStorage.removeItem('customerToken');
      } else {
        setCartError('Failed to add to cart');
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setReviewSuccess('Review submitted!');
    setReviewError('');

    if (!userOrderId) {
      setReviewError('Order verification failed. Please refresh the page.');
      return;
    }
    try {
      await api.post('/api/feedback/add', {
        product_id: id,
        order_id: userOrderId,
        rating,
        comment
      });
      if (!userOrderId) {
        setReviewError('Order verification failed. Please refresh the page.');
        return;
      }
      setSuccess('Review submitted!');
      setComment('');
      setRating(5);
      fetchFeedbacks(); 
      setIsEligible(false); 
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
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
          <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const cakeTotal = Number(cake.product_price) * quantity;

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
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="quantity-btn">-</button>
                <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} min="1" />
                <button onClick={() => setQuantity(quantity + 1)} className="quantity-btn">+</button>
              </div>
            </div>
            <div className="cake-price-total">Rs.{cakeTotal}.00</div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            {success && <div className="success-message">{success}</div>}
            {cartError && <div className="error-message">{cartError}</div>}
          </div>
          {cake.allergens && (
            <div className="cake-allergens">
              <h3>Allergen Information</h3>
              <p>{cake.allergens}</p>
            </div>
          )}
        </div>
      </div>

      <hr className="section-divider" />

      <div className="reviews-section">
        <h2>Customer Reviews ({feedbacks.length})</h2>
        <div className="feedback-list">
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <div key={fb._id} className="feedback-item">
                <div className="feedback-header">
                  <span className="stars">{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</span>
                  <span className="customer-name">{fb.customer_name}</span>
                  <span className="date">{new Date(fb.createdAt).toLocaleDateString()}</span>
                </div>
                 <p className="comment">{fb.feedback_text || fb.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to try it!</p>
          )}
        </div>

        <div className="add-review-container">
          {isEligible ? (
            <form onSubmit={handleFeedbackSubmit} className="review-form">
              <h3>Write a Review</h3>
              <div className="rating-input">
                <label>Rating:</label>
                <div className="star-rating">
                  {[5 , 4 , 3 , 2 , 1].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= rating ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <textarea 
                placeholder="Share your thoughts about this cake..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          ) : (
            <div className="eligibility-notice">
              {reviewError && <p className="review-error-message">{reviewError}</p>}
              {reviewSuccess && <p className="review-success-message">{reviewSuccess}</p>} 

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CakeDetails;
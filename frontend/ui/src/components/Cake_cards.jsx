import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cake_cards = ({ product }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = React.useState(false);

  const addToWishlist = async (e) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await axios.post('http://localhost:3000/api/wishlist/add', { productId: product._id });
      alert('Added to wishlist');
    } catch { alert('Could not add to wishlist'); }
    finally { setAdding(false); }
  };

  return (
    <div className="cake-card" onClick={() => navigate(`/cakes/${product._id}`)}>
      {product.product_image
        ? <img src={product.product_image} alt={product.product_name} className="cake-image" />
        : <div className="no-image">No Image Available</div>
      }
      <button className="wishlist-btn" onClick={addToWishlist} disabled={adding} title="Wishlist">
        {adding ? '···' : '♥'}
      </button>
      <div className="cake-info">
        <h3>{product.product_name}</h3>
        <p>Rs. {product.product_price}</p>
      </div>
    </div>
  );
};

export default Cake_cards;

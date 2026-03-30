import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState({ product: [], customize: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCustomizes, setSelectedCustomizes] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cart');
      if (res.data.status === 'Success') setCart(res.data.data);
      else setError('Failed to fetch cart');
    } catch { setError('Failed to fetch cart'); }
    finally { setLoading(false); }
  };

  const handleProductSelect = (id) =>
    setSelectedProducts(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const handleCustomizeSelect = (id) =>
    setSelectedCustomizes(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSelectAll = () => {
    const total = cart.product.length + cart.customize.length;
    if (selectedProducts.length + selectedCustomizes.length === total) {
      setSelectedProducts([]); setSelectedCustomizes([]);
    } else {
      setSelectedProducts(cart.product.map(i => i._id));
      setSelectedCustomizes(cart.customize.map(i => i._id));
    }
  };

  const handleQuantityChange = async (type, id, action) => {
    setLoading(true);
    try { await api.post(`/api/cart/${action}`, { type, id }); fetchCart(); }
    catch { setError('Failed to update quantity'); setLoading(false); }
  };

  const handleRemove = async (type, id) => {
    setLoading(true);
    try {
      if (type === 'product') await api.delete(`/api/cart/remove-product/${id}`);
      else await api.delete(`/api/cart/remove-customize/${id}`);
      fetchCart();
    } catch { setError('Failed to remove item'); setLoading(false); }
  };

  const handleCheckout = async () => {
    if (!deliveryDate) { setError('Please select a delivery date.'); return; }
    setLoading(true); setError('');
    try {
      const products = cart.product.filter(i => selectedProducts.includes(i._id));
      const customizes = cart.customize.filter(i => selectedCustomizes.includes(i._id));
      const itemsPrice =
        products.reduce((s, i) => s + Number(i.product_price) * i.quantity, 0) +
        customizes.reduce((s, i) => s + Number(i.custom_price) * i.quantity, 0);

      const res = await api.post('/api/orders/add', {
        selectedProducts, selectedCustomizes,
        deliveryAddress: { address: '123 Main St', city: 'Metropolis', postalCode: '12345' },
        paymentMethod: 'card',
        itemsPrice, deliveryfee: 0, taxPrice: 0,
        totalPrice: itemsPrice, deliveryDate,
      });
      if (res.data.status === 'Order placed successfully.') {
        setSelectedProducts([]); setSelectedCustomizes([]);
        fetchCart(); navigate('/cakes');
      } else { setError('Checkout failed'); }
    } catch (err) { setError(err.response?.data?.message || 'Checkout failed'); }
    finally { setLoading(false); }
  };

  const selectedProductTotal = cart.product
    .filter(i => selectedProducts.includes(i._id))
    .reduce((s, i) => s + Number(i.product_price) * i.quantity, 0);
  const selectedCustomizeTotal = cart.customize
    .filter(i => selectedCustomizes.includes(i._id))
    .reduce((s, i) => s + Number(i.custom_price) * i.quantity, 0);
  const total = selectedProductTotal + selectedCustomizeTotal;
  const itemCount = cart.product.length + cart.customize.length;
  const selectedCount = selectedProducts.length + selectedCustomizes.length;

  return (
    <div className="cart-page-bg">
      <div className="cart-container">
      

        <h1 className="cart-page-title">Your Cart</h1>

        {itemCount === 0 && !loading ? (
          <div style={{ textAlign:'center', padding:'80px 20px', fontFamily:'Quicksand,sans-serif' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:18 }}>🛒</div>
            <p style={{ fontSize:'1.15rem', fontWeight:700, color:'#5a2a2a', marginBottom:8 }}>Your cart is empty</p>
            <p style={{ color:'#b08080', marginBottom:28, fontWeight:500 }}>Add some delicious cakes to get started!</p>
            <Link to="/cakes" style={{
              display:'inline-block', background:'linear-gradient(135deg,#e88585,#c85050)',
              color:'white', padding:'13px 36px', borderRadius:30, fontWeight:700,
              textDecoration:'none', fontFamily:'Quicksand,sans-serif', fontSize:'0.96rem'
            }}>Browse Cakes</Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* ── Items ── */}
            <div className="cart-items">
              <div className="select-all-header">
                <label className="select-all">
                  <input type="checkbox"
                    checked={selectedCount === itemCount && itemCount > 0}
                    onChange={handleSelectAll} />
                  <span>Select all ({itemCount})</span>
                </label>
              </div>

              {/* Products */}
              {cart.product.map(item => (
                <div className="cart-item" key={item._id}>
                  <div className="item-checkbox">
                    <input type="checkbox"
                      checked={selectedProducts.includes(item._id)}
                      onChange={() => handleProductSelect(item._id)} />
                  </div>
                  {item.product_image && (
                    <img src={item.product_image} alt={item.product_name} className="cart-item-image" />
                  )}
                  <div className="item-details">
                    <h3>{item.product_name}</h3>
                    <div className="item-pricing">
                      <div>
                        <div className="current-price">Rs. {Number(item.product_price).toFixed(2)} each</div>
                        <div className="multi-price">Rs. {(Number(item.product_price) * item.quantity).toFixed(2)}</div>
                      </div>
                      <div className="quantity-selector">
                        <button className="quantity-btn" disabled={loading} onClick={() => handleQuantityChange('product', item._id, 'decrease')}>−</button>
                        <span>{item.quantity}</span>
                        <button className="quantity-btn" disabled={loading} onClick={() => handleQuantityChange('product', item._id, 'increase')}>+</button>
                        <button className="remove-btn" disabled={loading} onClick={() => handleRemove('product', item._id)}> Remove </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Custom cakes */}
              {cart.customize.map(item => (
                <div className="cart-item" key={item._id}>
                  <div className="item-checkbox">
                    <input type="checkbox"
                      checked={selectedCustomizes.includes(item._id)}
                      onChange={() => handleCustomizeSelect(item._id)} />
                  </div>
                  <div style={{
                    width:100, height:100, borderRadius:12,
                    background:'linear-gradient(135deg,#fde8e8,#fff4f4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'2.2rem', flexShrink:0
                  }}>🎂</div>
                  <div className="item-details">
                    <h3>Custom Cake</h3>
                    {item.custom_ingredients?.length > 0 && (
                      <ul className="cart-ingredients-list">
                        {item.custom_ingredients.map(ing => (
                          <li key={ing._id}>{ing.name} ({ing.quantity} {ing.unit})</li>
                        ))}
                      </ul>
                    )}
                    <div className="item-pricing">
                      <div className="multi-price">Rs. {Number(item.custom_price).toFixed(2)}</div>
                      <div className="quantity-selector">
                        <button disabled={loading} onClick={() => handleQuantityChange('customize', item._id, 'decrease')}>−</button>
                        <span>{item.quantity}</span>
                        <button disabled={loading} onClick={() => handleQuantityChange('customize', item._id, 'increase')}>+</button>
                        <button className="remove-btn" disabled={loading} onClick={() => handleRemove('customize', item._id)}>Remove</button> 
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Items selected</span><span>{selectedCount}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span><span>Rs. {total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span style={{ color:'#4caf50', fontWeight:700 }}>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span><span>Rs. {total.toFixed(2)}</span>
              </div>
              <p className="payment-note">Final price confirmed at checkout.</p>

              <div className="delivery-date">
                <label htmlFor="delivery-date">Delivery Date</label>
                <input type="date" id="delivery-date"
                  value={deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDeliveryDate(e.target.value)} />
              </div>

              <button className="checkout-button"
                disabled={loading || selectedCount === 0}
                onClick={handleCheckout}>
                {loading ? 'Processing…' : `Checkout (${selectedCount} item${selectedCount !== 1 ? 's' : ''})`}
              </button>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

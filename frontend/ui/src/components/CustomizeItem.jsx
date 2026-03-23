import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomizeItem.css';

const CustomizeItem = () => {
  const [customizeData, setCustomizeData] = useState({
    custom_layers: 2, custom_size: '', custom_shape: '',
    custom_bases: [], custom_filling: [], custom_frosting: null,
    custom_decorations: null, custom_price: 0, custom_specifications: '', ingredients: []
  });
  const [availableOptions, setAvailableOptions] = useState({
    cake_base: [], filling: [], frosting: [], decorations: []
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(''), 3500); return () => clearTimeout(t); } }, [success]);
  useEffect(() => { if (error)   { const t = setTimeout(() => setError(''),   6000); return () => clearTimeout(t); } }, [error]);

  useEffect(() => {
    setCustomizeData(prev => ({
      ...prev,
      custom_bases: Array(prev.custom_layers).fill(null),
      custom_filling: Array(Math.max(prev.custom_layers - 1, 0)).fill(null)
    }));
  }, [customizeData.custom_layers]);

  useEffect(() => {
    if (customizeData.custom_size && customizeData.custom_shape) fetchAvailableOptions();
  }, [customizeData.custom_size, customizeData.custom_shape]);

  const fetchAvailableOptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/customizes/available-options?size=${customizeData.custom_size}&shape=${customizeData.custom_shape}`
      );
      if (res.data.status === 'Success') {
        const opts = res.data.data;
        setAvailableOptions({
          cake_base: opts.cake_base || [], filling: opts.filling || [],
          frosting: opts.frosting || [], decorations: opts.decorations || []
        });
      } else { setError(res.data.message || 'Failed to fetch options'); }
    } catch (err) { setError('Failed to fetch options: ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'custom_layers') {
      const layers = parseInt(value);
      if (layers < 2) { setError('Number of layers must be at least 2'); return; }
      setCustomizeData(prev => ({
        ...prev, [name]: layers,
        custom_bases: Array(layers).fill(null),
        custom_filling: Array(Math.max(layers - 1, 0)).fill(null)
      }));
    } else {
      setCustomizeData(prev => ({ ...prev, [name]: value }));
      if (name === 'custom_size' || name === 'custom_shape') {
        setCustomizeData(prev => ({
          ...prev, [name]: value,
          custom_bases: prev.custom_bases.map(() => null),
          custom_filling: prev.custom_filling.map(() => null),
          custom_frosting: null, custom_decorations: null, custom_price: 0
        }));
      }
    }
  };

  const handleBaseSelect = (idx, id) => {
    const opt = availableOptions.cake_base.find(o => o._id === id);
    if (!opt) return;
    setCustomizeData(prev => { const nb = [...prev.custom_bases]; nb[idx] = opt; return { ...prev, custom_bases: nb }; });
  };
  const handleFillingSelect = (idx, id) => {
    const opt = availableOptions.filling.find(o => o._id === id);
    if (!opt) return;
    setCustomizeData(prev => { const nf = [...prev.custom_filling]; nf[idx] = opt; return { ...prev, custom_filling: nf }; });
  };
  const handleFrostingSelect = (id) => {
    const opt = availableOptions.frosting.find(o => o._id === id);
    setCustomizeData(prev => ({ ...prev, custom_frosting: opt || null }));
  };
  const handleDecorationSelect = (id) => {
    const opt = availableOptions.decorations.find(o => o._id === id);
    setCustomizeData(prev => ({ ...prev, custom_decorations: opt || null }));
  };

  // Recalculate price
  useEffect(() => {
    let total = 0;
    customizeData.custom_bases.forEach(b => { if (b?.option_price) total += b.option_price; });
    customizeData.custom_filling.forEach(f => { if (f?.option_price) total += f.option_price; });
    if (customizeData.custom_frosting?.option_price) total += customizeData.custom_frosting.option_price;
    if (customizeData.custom_decorations?.option_price) total += customizeData.custom_decorations.option_price;
    setCustomizeData(prev => ({ ...prev, custom_price: total }));
  }, [customizeData.custom_bases, customizeData.custom_filling, customizeData.custom_frosting, customizeData.custom_decorations]);

  const validateForm = () => {
    if (!customizeData.custom_size || !customizeData.custom_shape) { setError('Please select size and shape'); return false; }
    if (customizeData.custom_layers < 2) { setError('Minimum 2 layers required'); return false; }
    if (customizeData.custom_bases.some(b => !b)) { setError('Please select a base for each layer'); return false; }
    if (customizeData.custom_filling.some(f => !f)) { setError('Please select a filling for each gap'); return false; }
    if (!customizeData.custom_frosting) { setError('Please select a frosting'); return false; }
    if (!customizeData.custom_decorations) { setError('Please select decorations'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const custRes = await axios.post('http://localhost:3000/api/customizes/add', customizeData);
      if (custRes.data.status === 'Success') {
        const cartRes = await axios.post('http://localhost:3000/api/cart/add-customize', {
          customize_id: custRes.data.data._id, quantity: 1
        });
        if (cartRes.data.status === 'Success') {
          setSuccess('Your custom cake has been added to cart!');
          setCustomizeData({
            custom_layers: 2, custom_size: '', custom_shape: '',
            custom_bases: [], custom_filling: [], custom_frosting: null,
            custom_decorations: null, custom_price: 0, custom_specifications: '', ingredients: []
          });
        } else { setError('Failed to add to cart. Please try again.'); }
      } else { setError('Failed to save customization.'); }
    } catch (err) { setError(err.response?.data?.message || 'An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="customize-container1">
      {/* Hero */}
      <div className="customize-hero">
        <div className="customize-hero-text">
          <h1>Customize Your Cake</h1>
          <p>Design every layer, filling &amp; decoration exactly how you want it</p>
        </div>
      </div>

      {/* Form card */}
      <div className="customize-form-wrap">
        {success && <div className="customize-alert-success">{success}</div>}
        {error   && <div className="customize-alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit} className="customize-form">
          <h2 className="form-heading">Build Your Cake</h2>

          {/* Basic settings */}
          <p className="customize-section-label">Basic Settings</p>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Layers (min. 2)</Form.Label>
                <Form.Control type="number" name="custom_layers"
                  value={customizeData.custom_layers} onChange={handleChange} min="2" required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Size</Form.Label>
                <Form.Select name="custom_size" value={customizeData.custom_size} onChange={handleChange} required>
                  <option value="">Select Size</option>
                  <option value="6">6 inch</option>
                  <option value="8">8 inch</option>
                  <option value="10">10 inch</option>
                  <option value="12">12 inch</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Shape</Form.Label>
                <Form.Select name="custom_shape" value={customizeData.custom_shape} onChange={handleChange} required>
                  <option value="">Select Shape</option>
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="heart">Heart</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Bases */}
          {customizeData.custom_bases.length > 0 && (
            <>
              <p className="customize-section-label">Cake Bases</p>
              {customizeData.custom_bases.map((base, idx) => (
                <Row key={idx} className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Layer {idx + 1} Base</Form.Label>
                      <Form.Select value={base?._id || ''} onChange={e => handleBaseSelect(idx, e.target.value)} required>
                        <option value=''>Select Base for Layer {idx + 1}</option>
                        {availableOptions.cake_base.map(opt => (
                          <option key={opt._id} value={opt._id}>{opt.option_flavor} — Rs. {opt.option_price}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              ))}
            </>
          )}

          {/* Fillings */}
          {customizeData.custom_filling.length > 0 && (
            <>
              <p className="customize-section-label">Fillings</p>
              {customizeData.custom_filling.map((filling, idx) => (
                <Row key={idx} className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Filling between Layer {idx + 1} &amp; {idx + 2}</Form.Label>
                      <Form.Select value={filling?._id || ''} onChange={e => handleFillingSelect(idx, e.target.value)} required>
                        <option value=''>Select Filling</option>
                        {availableOptions.filling.map(opt => (
                          <option key={opt._id} value={opt._id}>{opt.option_flavor} — Rs. {opt.option_price}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              ))}
            </>
          )}

          {/* Frosting & Decorations */}
          <p className="customize-section-label">Frosting &amp; Decorations</p>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Frosting</Form.Label>
                <Form.Select value={customizeData.custom_frosting?._id || ''} onChange={e => handleFrostingSelect(e.target.value)} required>
                  <option value=''>Select Frosting</option>
                  {availableOptions.frosting.map(opt => (
                    <option key={opt._id} value={opt._id}>{opt.option_flavor} — Rs. {opt.option_price}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Decorations</Form.Label>
                <Form.Select value={customizeData.custom_decorations?._id || ''} onChange={e => handleDecorationSelect(e.target.value)} required>
                  <option value=''>Select Decorations</option>
                  {availableOptions.decorations.map(opt => (
                    <option key={opt._id} value={opt._id}>{opt.option_flavor} — Rs. {opt.option_price}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Special instructions */}
          <p className="customize-section-label">Special Instructions</p>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Edible Print Message (optional)</Form.Label>
                <Form.Control as="textarea" name="custom_specifications"
                  value={customizeData.custom_specifications} onChange={handleChange}
                  rows={2} placeholder="e.g., Happy Birthday Sarah! 🎂" />
              </Form.Group>
            </Col>
          </Row>

          {/* Total + Submit */}
          <div className="customize-action-bar">
            <div>
              <div className="total-price-label">Total Price</div>
              <div className="total-price">Rs. {customizeData.custom_price.toFixed(2)}</div>
            </div>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Adding to Cart…' : 'Add to Cart'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CustomizeItem;

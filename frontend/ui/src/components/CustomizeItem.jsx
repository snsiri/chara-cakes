import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomizeItem.css'; // Assuming you have a CSS file for styling

const CustomizeItem = () => {
  const [customizeData, setCustomizeData] = useState({
    custom_layers: 2,
    custom_size: '',
    custom_shape: '',
    custom_bases: [],
    custom_filling: [],
    custom_frosting: null,
    custom_decorations: null,
    custom_price: 0,
    custom_specifications: '',
    ingredients: []
  });

  const [availableOptions, setAvailableOptions] = useState({
    cake_base: [],
    filling: [],
    frosting: [],
    decorations: []
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initialize custom_bases and custom_filling arrays when custom_layers changes
  useEffect(() => {
    setCustomizeData(prev => ({
      ...prev,
      custom_bases: Array(prev.custom_layers).fill(null),
      custom_filling: Array(Math.max(prev.custom_layers - 1, 0)).fill(null)
    }));
  }, [customizeData.custom_layers]);

  // Fetch available options when size or shape changes
  useEffect(() => {
    if (customizeData.custom_size && customizeData.custom_shape) {
      fetchAvailableOptions();
    }
  }, [customizeData.custom_size, customizeData.custom_shape]);

  const fetchAvailableOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/customizes/available-options?size=${customizeData.custom_size}&shape=${customizeData.custom_shape}`
      );
      
      if (response.data.status === 'Success') {
        // Transform the data to match our component's structure
        const options = response.data.data;
        setAvailableOptions({
          cake_base: options.cake_base || [],
          filling: options.filling || [],
          frosting: options.frosting || [],
          decorations: options.decorations || []
        });
      } else {
        setError(response.data.message || 'Failed to fetch available options');
      }
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to fetch available options: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'custom_layers') {
      const layers = parseInt(value);
      if (layers < 2) {
        setError('Number of layers must be at least 2');
        return;
      }
      setCustomizeData(prev => ({
        ...prev,
        [name]: layers,
        custom_bases: Array(layers).fill(null),
        custom_filling: Array(Math.max(layers - 1, 0)).fill(null)
      }));
    } else {
    setCustomizeData(prev => ({
      ...prev,
      [name]: value
    }));
    }

    // If changing size or shape, reset selections
    if (name === 'custom_size' || name === 'custom_shape') {
      setCustomizeData(prev => ({
        ...prev,
        custom_bases: prev.custom_bases.map(() => null),
        custom_filling: prev.custom_filling.map(() => null),
        custom_frosting: null,
        custom_decorations: null,
        custom_price: 0,
        ingredients: []
      }));
    }
  };

  const handleBaseSelect = (layerIndex, optionId) => {
    const option = availableOptions.cake_base.find(opt => opt._id === optionId);
    if (!option) return;
    setCustomizeData(prev => {
      const newBases = [...prev.custom_bases];
      newBases[layerIndex] = option;
      return { ...prev, custom_bases: newBases };
    });
  };

  const handleFillingSelect = (layerIndex, optionId) => {
    const option = availableOptions.filling.find(opt => opt._id === optionId);
    if (!option) return;
    setCustomizeData(prev => {
      const newFillings = [...prev.custom_filling];
      newFillings[layerIndex] = option;
      return { ...prev, custom_filling: newFillings };
    });
  };

  const handleFrostingSelect = (optionId) => {
    const option = availableOptions.frosting.find(opt => opt._id === optionId);
    setCustomizeData(prev => ({ ...prev, custom_frosting: option }));
  };

  const handleDecorationSelect = (optionId) => {
    const option = availableOptions.decorations.find(opt => opt._id === optionId);
    setCustomizeData(prev => ({ ...prev, custom_decorations: option }));
  };

  const validateForm = () => {
    if (!customizeData.custom_size || !customizeData.custom_shape || 
        !customizeData.custom_frosting || !customizeData.custom_decorations) {
      setError('Please fill in all required fields');
      return false;
    }
    if (customizeData.custom_layers < 2) {
      setError('Number of layers must be at least 2');
      return false;
    }
    if (customizeData.custom_bases.some(base => !base || typeof base !== 'object')) {
      setError('Please select a base for each layer');
      return false;
    }
    if (customizeData.custom_filling.some(filling => !filling || typeof filling !== 'object')) {
      setError('Please select a filling for each layer gap');
      return false;
    }
    if (!['6', '8', '10', '12'].includes(customizeData.custom_size)) {
      setError('Invalid size. Must be one of: 6, 8, 10, 12');
      return false;
    }
    if (!['round', 'square', 'heart'].includes(customizeData.custom_shape.toLowerCase())) {
      setError('Invalid shape. Must be one of: round, square, heart');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Step 1: Save the customization to get its ID
      const customizeResponse = await axios.post('http://localhost:3000/api/customizes/add', customizeData);
      
      if (customizeResponse.data.status === 'Success') {
        const savedCustomizationId = customizeResponse.data.data._id;
        
        // Step 2: Add the saved customization to the cart using its ID (correct endpoint and payload)
        const cartResponse = await axios.post('http://localhost:3000/api/cart/add-customize', {
          customize_id: savedCustomizationId,
          quantity: 1
        });

        if (cartResponse.data.status === 'Success') {
          setSuccess('Customized item saved and added to cart successfully!');
        setCustomizeData({
            custom_layers: 2,
          custom_size: '',
          custom_shape: '',
            custom_bases: [],
            custom_filling: [],
            custom_frosting: null,
            custom_decorations: null,
          custom_price: 0,
          custom_specifications: '',
          ingredients: []
        });
      } else {
          setError('Failed to add item to cart');
        }
      } else {
        setError('Failed to save customization');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Recalculate total price whenever bases, fillings, frosting, or decorations change
  useEffect(() => {
    let totalPrice = 0;
    customizeData.custom_bases.forEach(base => {
      if (base && base.option_price) totalPrice += base.option_price;
    });
    customizeData.custom_filling.forEach(filling => {
      if (filling && filling.option_price) totalPrice += filling.option_price;
    });
    if (customizeData.custom_frosting && customizeData.custom_frosting.option_price) {
      totalPrice += customizeData.custom_frosting.option_price;
    }
    if (customizeData.custom_decorations && customizeData.custom_decorations.option_price) {
      totalPrice += customizeData.custom_decorations.option_price;
    }
    setCustomizeData(prev => ({ ...prev, custom_price: totalPrice }));
  }, [customizeData.custom_bases, customizeData.custom_filling, customizeData.custom_frosting, customizeData.custom_decorations]);

  return (
  <Container fluid className="customize-container1 mt-4">
    <Row className="mb-4 align-items-center">
      
        <h2 className="form-heading">Customize your cake</h2>
      
      
    </Row>

    {success && <Alert variant="success">{success}</Alert>}
    {error && <Alert variant="danger">{error}</Alert>}

    <Form onSubmit={handleSubmit} className="customize-form">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Number of Layers (Minimum 2)</Form.Label>
            <Form.Control
              type="number"
              name="custom_layers"
              value={customizeData.custom_layers}
              onChange={handleChange}
              min="2"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Size</Form.Label>
            <Form.Select
              name="custom_size"
              value={customizeData.custom_size}
              onChange={handleChange}
              required
            >
              <option value="">Select Size</option>
              <option value="6">6 inch</option>
              <option value="8">8 inch</option>
              <option value="10">10 inch</option>
              <option value="12">12 inch</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Shape</Form.Label>
            <Form.Select
              name="custom_shape"
              value={customizeData.custom_shape}
              onChange={handleChange}
              required
            >
              <option value="">Select Shape</option>
              <option value="round">Round</option>
              <option value="square">Square</option>
              <option value="heart">Heart</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {customizeData.custom_bases.map((base, index) => (
        <Row key={index} className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Layer {index + 1} Base</Form.Label>
              <Form.Select
                value={base?._id || ''}
                onChange={e => handleBaseSelect(index, e.target.value)}
                required
              >
                <option value=''>Select Base for Layer {index + 1}</option>
                {availableOptions.cake_base.map(option => (
                  <option key={option._id} value={option._id}>
                    {option.option_flavor} - Rs.{option.option_price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      ))}

      {customizeData.custom_filling.map((filling, index) => (
        <Row key={index} className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Filling between Layer {index + 1} and {index + 2}</Form.Label>
              <Form.Select
                value={filling?._id || ''}
                onChange={e => handleFillingSelect(index, e.target.value)}
                required
              >
                <option value=''>Select Filling</option>
                {availableOptions.filling.map(option => (
                  <option key={option._id} value={option._id}>
                    {option.option_flavor} - Rs.{option.option_price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Frosting</Form.Label>
            <Form.Select
              value={customizeData.custom_frosting?._id || ''}
              onChange={e => handleFrostingSelect(e.target.value)}
              required
            >
              <option value=''>Select Frosting</option>
              {availableOptions.frosting.map(option => (
                <option key={option._id} value={option._id}>
                  {option.option_flavor} - Rs.{option.option_price}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Decorations</Form.Label>
            <Form.Select
              value={customizeData.custom_decorations?._id || ''}
              onChange={e => handleDecorationSelect(e.target.value)}
              required
            >
              <option value=''>Select Decorations</option>
              {availableOptions.decorations.map(option => (
                <option key={option._id} value={option._id}>
                  {option.option_flavor} - Rs.{option.option_price}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Special Instructions (edible print message)</Form.Label>
            <Form.Control
              as="textarea"
              name="custom_specifications"
              value={customizeData.custom_specifications}
              onChange={handleChange}
              rows={2}
              placeholder="e.g., Happy Birthday!"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h4 className="total-price">Total Price: Rs.{customizeData.custom_price.toFixed(2)}</h4>
        </Col>
      </Row>

      <Button variant="primary" type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Submitting...' : 'Submit Customization'}
      </Button>
    </Form>
  </Container>
);

};

export default CustomizeItem; 
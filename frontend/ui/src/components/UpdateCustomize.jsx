import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateCustomize = () => {
  const [customizes, setCustomizes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCustomize, setCurrentCustomize] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [availableOptions, setAvailableOptions] = useState({
    cake_base: [],
    filling: [],
    frosting: [],
    decorations: []
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomizes();
  }, []);

  const fetchCustomizes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/customizes');
      if (response.data.status === 'Success') {
        setCustomizes(response.data.data || []);
      } else {
        setErrorMessage('Failed to fetch customizations');
      }
    } catch (error) {
      console.error('Error fetching customizations:', error);
      setErrorMessage('Failed to fetch customizations');
    }
  };

  const openUpdateModal = async (customize) => {
    try {
      setLoading(true);
      // Fetch available options first
      const optionsResponse = await axios.get(
        `http://localhost:3000/api/customizes/available-options?size=${customize.custom_size}&shape=${customize.custom_shape}`
      );

      if (optionsResponse.data.status === 'Success') {
        setAvailableOptions({
          cake_base: optionsResponse.data.data.cake_base || [],
          filling: optionsResponse.data.data.filling || [],
          frosting: optionsResponse.data.data.frosting || [],
          decorations: optionsResponse.data.data.decorations || []
        });

        // Set current customization and its data
        setCurrentCustomize(customize);
        
        // Initialize the data with proper structure
        const initialData = {
          ...customize,
          custom_bases: customize.custom_bases || [],
          custom_filling: customize.custom_filling || [],
          custom_frosting: customize.custom_frosting || {},
          custom_decorations: customize.custom_decorations || {},
          custom_price: customize.custom_price || 0
        };

        setUpdatedData(initialData);
        
        // Calculate initial price
        let total = 0;
        
        // Add prices from all bases
        if (initialData.custom_bases) {
          total += initialData.custom_bases.reduce((sum, base) => sum + (base?.option_price || 0), 0);
        }
        
        // Add prices from all fillings
        if (initialData.custom_filling) {
          total += initialData.custom_filling.reduce((sum, filling) => sum + (filling?.option_price || 0), 0);
        }
        
        // Add price from frosting
        if (initialData.custom_frosting) {
          total += initialData.custom_frosting.option_price || 0;
        }
        
        // Add price from decorations
        if (initialData.custom_decorations) {
          total += initialData.custom_decorations.option_price || 0;
        }
        
        setUpdatedData(prev => ({ ...prev, custom_price: total }));
        setShowModal(true);
      } else {
        setErrorMessage('Failed to fetch available options');
      }
    } catch (error) {
      console.error('Error opening update modal:', error);
      setErrorMessage('Failed to load customization data');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCustomize(null);
    setUpdatedData({});
    setAvailableOptions({
      cake_base: [],
      filling: [],
      frosting: [],
      decorations: []
    });
  };

  const handleInputChange = (field, value) => {
    setUpdatedData(prev => ({ ...prev, [field]: value }));
  };

  const handleBaseSelect = (layerIndex, optionId) => {
    const option = availableOptions.cake_base.find(opt => opt._id === optionId);
    if (!option) return;
    setUpdatedData(prev => {
      const newBases = [...(prev.custom_bases || [])];
      newBases[layerIndex] = option;
      return { ...prev, custom_bases: newBases };
    });
    calculateTotalPrice();
  };

  const handleFillingSelect = (layerIndex, optionId) => {
    const option = availableOptions.filling.find(opt => opt._id === optionId);
    if (!option) return;
    setUpdatedData(prev => {
      const newFillings = [...(prev.custom_filling || [])];
      newFillings[layerIndex] = option;
      return { ...prev, custom_filling: newFillings };
    });
    calculateTotalPrice();
  };

  const handleFrostingSelect = (optionId) => {
    const option = availableOptions.frosting.find(opt => opt._id === optionId);
    if (!option) return;
    setUpdatedData(prev => ({ ...prev, custom_frosting: option }));
    calculateTotalPrice();
  };

  const handleDecorationSelect = (optionId) => {
    const option = availableOptions.decorations.find(opt => opt._id === optionId);
    if (!option) return;
    setUpdatedData(prev => ({ ...prev, custom_decorations: option }));
    calculateTotalPrice();
  };

  const calculateTotalPrice = () => {
    setUpdatedData(prev => {
      let total = 0;
      
      // Add prices from all bases
      if (prev.custom_bases) {
        total += prev.custom_bases.reduce((sum, base) => sum + (base?.option_price || 0), 0);
      }
      
      // Add prices from all fillings
      if (prev.custom_filling) {
        total += prev.custom_filling.reduce((sum, filling) => sum + (filling?.option_price || 0), 0);
      }
      
      // Add price from frosting
      if (prev.custom_frosting) {
        total += prev.custom_frosting.option_price || 0;
      }
      
      // Add price from decorations
      if (prev.custom_decorations) {
        total += prev.custom_decorations.option_price || 0;
      }
      
      return { ...prev, custom_price: total };
    });
  };

  const handleUpdate = async () => {
    if (!currentCustomize) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3000/api/customizes/update/${currentCustomize._id}`,
        updatedData
      );
      
      if (response.data.status === 'Success') {
        await fetchCustomizes(); // Refresh the list
        closeModal();
        setSuccessMessage('Customization updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.data.message || 'Failed to update customization');
      }
    } catch (error) {
      console.error('Error updating customization:', error);
      setErrorMessage('Failed to update customization');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/customizes/delete/${id}`);
      if (response.data.status === 'Success') {
        setCustomizes(customizes.filter(c => c._id !== id));
        setSuccessMessage('Customization deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.data.message || 'Failed to delete customization');
      }
    } catch (error) {
      console.error('Error deleting customization:', error);
      setErrorMessage('Failed to delete customization');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Manage Customizations</h2>
      {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger" className="mb-3">{errorMessage}</Alert>}
      <Row xs={1} md={2} lg={3} className="g-4">
        {customizes.length === 0 ? (
          <Col>
            <Alert variant="info">No customizations found!</Alert>
          </Col>
        ) : (
          customizes.map((customize, index) => (
            <Col key={index}>
              <Card className="h-100">
                <Card.Body>
                  <h5>{customize.custom_size} inch, {customize.custom_shape}</h5>
                  <p><b>Layers:</b> {customize.custom_layers}</p>
                  <p><b>Price:</b> Rs.{customize.custom_price}</p>
                  <div className="d-flex justify-content-between mt-3">
                    <Button 
                      variant="primary" 
                      onClick={() => openUpdateModal(customize)}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Edit'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this customization?")) {
                          handleDelete(customize._id);
                        }
                      }}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Update Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Customization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCustomize && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Size</Form.Label>
                <Form.Select
                  name="custom_size"
                  value={updatedData.custom_size || ''}
                  onChange={e => handleInputChange('custom_size', e.target.value)}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="6">6 inch</option>
                  <option value="8">8 inch</option>
                  <option value="10">10 inch</option>
                  <option value="12">12 inch</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Shape</Form.Label>
                <Form.Select
                  name="custom_shape"
                  value={updatedData.custom_shape || ''}
                  onChange={e => handleInputChange('custom_shape', e.target.value)}
                  required
                >
                  <option value="">Select Shape</option>
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="heart">Heart</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Number of Layers</Form.Label>
                <Form.Control
                  type="number"
                  min={2}
                  max={5}
                  name="custom_layers"
                  value={updatedData.custom_layers || 2}
                  onChange={e => {
                    const val = Math.max(2, Math.min(5, Number(e.target.value)));
                    handleInputChange('custom_layers', val);
                    // Adjust bases/fillings arrays to match new layer count
                    setUpdatedData(prev => ({
                      ...prev,
                      custom_bases: (prev.custom_bases || []).slice(0, val).concat(Array(val).fill(null)).slice(0, val),
                      custom_filling: (prev.custom_filling || []).slice(0, val - 1).concat(Array(val - 1).fill(null)).slice(0, val - 1)
                    }));
                  }}
                  required
                />
              </Form.Group>

              {[...Array(Number(updatedData.custom_layers || 2)).keys()].map(layerIdx => (
                <Row key={layerIdx} className="mb-2">
                  <Col>
                    <Form.Group>
                      <Form.Label>Base for Layer {layerIdx + 1}</Form.Label>
                      <Form.Select
                        value={updatedData.custom_bases?.[layerIdx]?._id || ''}
                        onChange={e => handleBaseSelect(layerIdx, e.target.value)}
                        required
                      >
                        <option value="">Select Base</option>
                        {availableOptions.cake_base.map(opt => (
                          <option key={opt._id} value={opt._id}>
                            {opt.option_flavor} (Rs.{opt.option_price})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* Only show filling if it's not the last layer */}
                  {layerIdx < (updatedData.custom_layers - 1) && (
                    <Col>
                      <Form.Group>
                        <Form.Label>Filling between Layer {layerIdx + 1} and {layerIdx + 2}</Form.Label>
                        <Form.Select
                          value={updatedData.custom_filling?.[layerIdx]?._id || ''}
                          onChange={e => handleFillingSelect(layerIdx, e.target.value)}
                          required
                        >
                          <option value="">Select Filling</option>
                          {availableOptions.filling.map(opt => (
                            <option key={opt._id} value={opt._id}>
                              {opt.option_flavor} (${opt.option_price})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  )}
                </Row>
              ))}

              <Form.Group className="mb-3">
                <Form.Label>Frosting</Form.Label>
                <Form.Select
                  value={updatedData.custom_frosting?._id || ''}
                  onChange={e => handleFrostingSelect(e.target.value)}
                  required
                >
                  <option value="">Select Frosting</option>
                  {availableOptions.frosting.map(opt => (
                    <option key={opt._id} value={opt._id}>
                      {opt.option_flavor} (Rs.{opt.option_price})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Decorations</Form.Label>
                <Form.Select
                  value={updatedData.custom_decorations?._id || ''}
                  onChange={e => handleDecorationSelect(e.target.value)}
                  required
                >
                  <option value="">Select Decorations</option>
                  {availableOptions.decorations.map(opt => (
                    <option key={opt._id} value={opt._id}>
                      {opt.option_flavor} (${opt.option_price})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Special Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  name="custom_specifications"
                  value={updatedData.custom_specifications || ''}
                  onChange={e => handleInputChange('custom_specifications', e.target.value)}
                  rows={3}
                />
              </Form.Group>

              <div className="mb-3">
                <h4>Total Price: Rs.{updatedData.custom_price || 0}</h4>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  // Validation: all fields must be filled
                  if (!updatedData.custom_size || !updatedData.custom_shape ||
                    !updatedData.custom_layers ||
                    !updatedData.custom_bases || updatedData.custom_bases.length < updatedData.custom_layers ||
                    updatedData.custom_bases.some(b => !b || !b._id) ||
                    !updatedData.custom_filling || updatedData.custom_filling.length < updatedData.custom_layers-1 ||
                    updatedData.custom_filling.some(f => !f || !f._id) ||
                    !updatedData.custom_frosting || !updatedData.custom_frosting._id ||
                    !updatedData.custom_decorations || !updatedData.custom_decorations._id
                  ) {
                    setErrorMessage('Please fill all fields for all layers.');
                    setTimeout(() => setErrorMessage(''), 3000);
                    return;
                  }
                  handleUpdate();
                }}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Customization'}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UpdateCustomize; 
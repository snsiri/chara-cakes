import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './OrderDetails.css';

const styles = {
  productsList: {
    maxHeight: '100px',
    overflow: 'auto',
    padding: '5px',
    border: '1px solid #dee2e6',
    borderRadius: '4px'
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '0.9rem'
  },
  customizationsList: {
    maxHeight: '100px',
    overflow: 'auto',
    padding: '5px',
    border: '1px solid #dee2e6',
    borderRadius: '4px'
  },
  customItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '0.9rem'
  },
  ingredientsList: {
    maxHeight: '100px',
    overflow: 'auto',
    padding: '5px',
    border: '1px solid #dee2e6',
    borderRadius: '4px'
  },
  ingredientItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '0.9rem'
  }
};

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCustomize, setSelectedCustomize] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showCustomizeDetails, setShowCustomizeDetails] = useState(false);


  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  // const fetchOrders = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get('http://localhost:4000/api/order/');
  //     // Transform the data to match our display format
  //     const formattedOrders = response.data.map(order => ({
  //       ...order,
  //       totalPrice: order.product.reduce((sum, item) => sum + (parseFloat(item.product_price) * item.quantity), 0) + 
  //                   order.customize.reduce((sum, item) => sum + (parseFloat(item.custom_price) * item.quantity), 0),
  //       createdAt: order.createdAt || new Date().toISOString(),
  //       deliveryStatus: order.isDelivered ? 'Delivered' : 'Pending'
  //     }));
  //     setOrders(formattedOrders);
  //     setError(null);
  //   } catch (err) {
  //     setError('Failed to fetch orders. Please try again later.');
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/orders/get');
      // Transform the data to match our display format
      const formattedOrders = response.data.map(order => ({
        ...order,
        totalPrice: order.product.reduce((sum, item) => sum + (parseFloat(item.product_price) * item.quantity), 0) + 
                    order.customize.reduce((sum, item) => sum + (parseFloat(item.custom_price) * item.quantity), 0),
        createdAt: order.createdAt || new Date().toISOString()
      }));
      setOrders(formattedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleCustomizeClick = (customize) => {
    setSelectedCustomize(customize);
    setShowCustomizeDetails(true);
  };

  const handleCloseDetails = () => {
    setShowProductDetails(false);
    setShowCustomizeDetails(false);
  };

  const handleMarkAsDelivered = async (orderId) => {
    if (!window.confirm('Mark this order as delivered?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/orders/completed/${orderId}`);
      await fetchOrders();
    } catch (err) {
      setError('Failed to mark order as delivered. Please try again.');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Orders</h2>
        <Link to="/admin/completed-orders" className="btn btn-info">
          View Completed Orders
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Delivery Time</th>
              <th>Delivery Address</th>
              <th>Products</th>
              <th>Customizations</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customer_id}</td>
                <td>LKR {order.totalPrice.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.delivery_time ? new Date(order.delivery_time).toLocaleString() : 'N/A'}
                </td>
                <td>
                  <div className="address-info">
                    <p>{order.deliveryAddress?.address}</p>
                    <p>{order.deliveryAddress?.city}</p>
                    <p>{order.deliveryAddress?.postalCode}</p>
                  </div>
                </td>
                <td>
                  <div style={styles.productsList}>
                    {order.product?.map((item, index) => (
                      <div key={index} style={styles.productItem} onClick={() => handleProductClick(item)}>
                        <span className="product-name">{item.product_name}</span>
                        <span className="product-quantity">x{item.quantity}</span>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>View Details</Tooltip>}
                        >
                          <span className="view-details">🔍</span>
                        </OverlayTrigger>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={styles.customizationsList}>
                    {order.customize?.map((item, index) => (
                      <div key={index} style={styles.customItem} onClick={() => handleCustomizeClick(item)}>
                        <span className="custom-name">Custom Product</span>
                        <span className="custom-quantity">x{item.quantity}</span>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>View Details</Tooltip>}
                        >
                          <span className="view-details">🔍</span>
                        </OverlayTrigger>
                      </div>
                    ))}
                  </div>
                </td>
                {/* <td>
                  <div style={styles.ingredientsList}>
                    {order.total_ingredients?.map((ing, index) => (
                      <div key={index} style={styles.ingredientItem}>
                        <span className="ingredient-name">{ing.name}</span>
                        <span className="ingredient-quantity">{ing.quantity} {ing.unit}</span>
                      </div>
                    ))}
                  </div>
                </td> */}
                <td>
                  {!order.isDelivered && (
                  <Button variant="success" size="sm" onClick={() => handleMarkAsDelivered(order._id)}>
                    Mark as Delivered
                  </Button>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Product Details Modal */}
      <Modal show={showProductDetails} onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <h4>{selectedProduct.product_name}</h4>
              <p>Price: LKR {selectedProduct.product_price}</p>
              <p>Quantity: {selectedProduct.quantity}</p>
              <p>Added Date: {new Date(selectedProduct.added_date).toLocaleString()}</p>
              <h5>Ingredients:</h5>
              <ul>
                {selectedProduct.ingredients?.map((ing) => (
                  <li key={ing._id}>{ing.name}: {ing.quantity} {ing.unit}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Customize Details Modal */}
      <Modal show={showCustomizeDetails} onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>Custom Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomize && (
            <div>
              <p>Price: LKR {selectedCustomize.custom_price}</p>
              <p>Quantity: {selectedCustomize.quantity}</p>
              <p>Added Date: {new Date(selectedCustomize.added_date).toLocaleString()}</p>
              <h5>Custom Ingredients:</h5>
              <ul>
                {selectedCustomize.custom_ingredients?.map((ing) => (
                  <li key={ing._id}>{ing.name}: {ing.quantity} {ing.unit}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>


    </div>
  );
};

export default OrderTable;
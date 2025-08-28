import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
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

const CompletedOrders = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/completed_order/');
      setCompletedOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch completed orders. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this completed order? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/completed_order/delete/${orderId}`);
      await fetchCompletedOrders();
    } catch (err) {
      setError('Failed to delete completed order. Please try again.');
      console.error(err);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseDetails = () => {
    setShowOrderDetails(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Completed Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Total Price</th>
            <th>Delivery Date</th>
            <th>Delivery Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map((order) => (
            <tr key={order._id} onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
              <td>{order._id}</td>
              <td>{order.customer_id}</td>
              <td>LKR {order.totalPrice.toFixed(2)}</td>
              <td>{new Date(order.deliveredAt).toLocaleString()}</td>
              <td>
                <div className="address-info">
                  <p>{order.deliveryAddress?.address}</p>
                  <p>{order.deliveryAddress?.city}</p>
                  <p>{order.deliveryAddress?.postalCode}</p>
                </div>
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(order._id);
                }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Order Details Modal */}
      <Modal show={showOrderDetails} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <h4>Order Information</h4>
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Customer ID:</strong> {selectedOrder.customer_id}</p>
              <p><strong>Delivery Date:</strong> {new Date(selectedOrder.deliveredAt).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              <p><strong>Total Amount:</strong> LKR {selectedOrder.totalPrice.toFixed(2)}</p>

              <h4>Products</h4>
              <div style={styles.productsList}>
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} style={styles.productItem}>
                    <span className="product-name">{item.product_name}</span>
                    <span className="product-quantity">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <h4>Delivery Address</h4>
              <div className="address-info">
                <p>{selectedOrder.deliveryAddress?.address}</p>
                <p>{selectedOrder.deliveryAddress?.city}</p>
                <p>{selectedOrder.deliveryAddress?.postalCode}</p>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CompletedOrders;

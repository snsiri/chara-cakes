import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import './OrderDetails.css';
import { Link } from 'react-router-dom';

const CompletedOrdersPage = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>Error: {error}</Container>;

  return (
    <Container className="mt-5">
      {/* Go Back Button */}
      <div className="mb-4">
        <Link to="/admin/ordertable" className="btn btn-outline-secondary me-3">
          <i className="fas fa-arrow-left me-1"></i>Go Back
        </Link>
      </div>
      <h2 className="mb-4">Completed Orders</h2>
      
      {/* Orders List */}
      <div className="mb-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Price</th>
              <th>Delivery Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.map((order) => (
              <tr key={order._id} onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
                <td>{order._id}</td>
                <td>{order.customer_id}</td>
                <td>{formatPrice(order.totalPrice)}</td>
                <td>{new Date(order.deliveredAt).toLocaleString()}</td>
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
      </div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <Card className="mb-4">
          <Card.Header>Order Details</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Customer ID:</strong> {selectedOrder.customer_id}</p>
                <p><strong>Delivery Date:</strong> {new Date(selectedOrder.deliveredAt).toLocaleString()}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Total Amount:</strong> {formatPrice(selectedOrder.totalPrice)}</p>
              </Col>
              <Col md={6}>
                <h4>Delivery Address</h4>
                <p>{selectedOrder.deliveryAddress?.address}</p>
                <p>{selectedOrder.deliveryAddress?.city}</p>
                <p>{selectedOrder.deliveryAddress?.postalCode}</p>
              </Col>
            </Row>

            <h4 className="mt-4">Products</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products?.map((item, index) => (
                  <tr key={index}>
                    <td>{item._id}</td>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.product_price)}</td>
                    <td>{formatPrice(item.product_price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h4 className="mt-4">Customizations</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Custom ID</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.customize?.map((item, index) => (
                  <tr key={index}>
                    <td>{item._id}</td>
                    <td>Custom Product</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.custom_price)}</td>
                    <td>{formatPrice(item.custom_price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CompletedOrdersPage;

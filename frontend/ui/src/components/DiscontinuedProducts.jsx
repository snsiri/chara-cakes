import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './DiscontinuedProducts.css';

const DiscontinuedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/discontinued_product');
      
      if (response.data && response.data.status === 'Success') {
        setProducts(response.data.data || []);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to fetch discontinued products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to fetch discontinued products');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (id) => {
    if (!window.confirm('Are you sure you want to restore this product?')) return;

    axios.put(`http://localhost:3000/api/discontinued_product/restore/${id}`)
      .then(() => {
        fetchProducts();
        setSuccessMessage('Product restored successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setErrorMessage('Failed to restore product');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;

    axios.delete(`http://localhost:3000/api/discontinued_product/delete/${id}`)
      .then(() => {
        fetchProducts();
        setSuccessMessage('Product deleted permanently');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setErrorMessage('Failed to delete product');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  return (
    <div className="discontinued-products-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      ) : errorMessage ? (
        <div className="error-container">
          <div className="alert alert-danger">
            <h4>Error!</h4>
            <p>{errorMessage}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <h2>Discontinued Products</h2>
            <p className="text-muted">Manage your discontinued products here</p>
          </div>

          {successMessage && (
            <div className="discounted-products-alert alert alert-success">
              <h4 className="alert-heading">Success!</h4>
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="discounted-products-alert alert alert-danger">
              <h4 className="alert-heading">Error!</h4>
              <p>{errorMessage}</p>
            </div>
          )}

          {Array.isArray(products) ? (
            products.length === 0 ? (
              <div className="discounted-products-empty">
                <h3>No Discontinued Products</h3>
                <p>All your products are currently active.</p>
              </div>
            ) : (
              <Table 
                className="discounted-products-table"
                striped 
                bordered 
                hover
              >
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Weight</th>
                    <th>Description</th>
                    <th>Flavor</th>
                    <th>Occasion</th>
                    <th>Specifications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.discontinued_product_name}</td>
                      <td>${product.discontinued_product_price}</td>
                      <td>{product.discontinued_product_weight}</td>
                      <td>{product.discontinued_product_description}</td>
                      <td>{product.discontinued_flavor?.join(', ') || '-'}</td>
                      <td>{product.discontinued_occasion?.join(', ') || '-'}</td>
                      <td>{product.discontinued_specification?.join(', ') || '-'}</td>
                      <td className="discounted-products-actions">
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => handleRestore(product._id)}
                          title="Restore product"
                        >
                          <i className="fas fa-undo-alt me-1"></i>Restore
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(product._id)}
                          title="Delete product permanently"
                        >
                          <i className="fas fa-trash-alt me-1"></i>Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          ) : (
            <div className="error-container">
              <div className="alert alert-warning">
                <h4>Warning!</h4>
                <p>Data structure is invalid</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiscontinuedProducts;

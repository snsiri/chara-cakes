import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomizeDetailsStyles.css';

const CustomizeDetails = () => {
  const [customizes, setCustomizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomizes();
  }, []);

  const fetchCustomizes = async () => {
    try {
      setLoading(true);
      const id = "6657fcb3b4c4b8e5d7b4f9c9";
      const response = await axios.get('http://localhost:3000/api/customizes/');
      if (response.data.status === 'Success') {
        setCustomizes(response.data.data || []);
        setError('');
      } else {
        setError('Failed to fetch customizes');
      }
    } catch (err) {
      setError('Failed to fetch customizes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (customizes.length === 0) {
    return <div>No customizes found</div>;
  }

  return (
    <div className="customize-list-container">
      <div className="header-section">
        <h2>Customize Items</h2>
      </div>
      <div className="customize-list">
        {customizes.map((customize) => (
          <div key={customize._id} className="customize-item">
            <div className="customize-item-header">
              <h3>{customize.custom_size} {customize.custom_shape} Cake</h3>
              <div className="customize-item-meta">
                <span>Layers: {customize.custom_layers}</span>
                <span>Price: ${customize.custom_price}</span>
              </div>
            </div>
            <div className="customize-item-details">
              <div className="detail-row">
                <div className="detail-label">Bases:</div>
                <div className="detail-value">
                  <ul>
                    {customize.custom_bases?.map((base, index) => (
                      <li key={index}>{base.option_flavor}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Fillings:</div>
                <div className="detail-value">
                  <ul>
                    {customize.custom_filling?.map((filling, index) => (
                      <li key={index}>{filling.option_flavor}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Frosting:</div>
                <div className="detail-value">
                  {customize.custom_frosting ? customize.custom_frosting.option_flavor : 'None'}
                </div>
              </div>
            </div>
            <div className="customize-item-actions">
              <button 
                className="view-button"
                onClick={() => window.location.href = `/admin/customize-details/${customize._id}`}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizeDetails;

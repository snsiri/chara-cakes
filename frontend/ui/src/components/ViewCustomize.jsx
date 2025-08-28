import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import './ViewCustomize.css';

const ViewCustomize = () => {
  const { id } = useParams();
  const [customizeItem, setCustomizeItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomizeItem();
  }, [id]);

  const fetchCustomizeItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/customizes/get/${id}`);
      if (response.data.status === 'Success') {
        setCustomizeItem(response.data.data);
        setError('');
      } else {
        setError('Failed to fetch customize item details');
      }
    } catch (err) {
      setError('Failed to fetch customize item details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 
  
  const generatePDF = () => {
  const element = document.getElementById('customize-details');

  // Hide the download button temporarily
  const button = document.querySelector('.pdf-button');
  if (button) button.style.display = 'none';

  const opt = {
    margin: 1,
    filename: `customize_${id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    // Restore the button after download
    if (button) button.style.display = 'inline-block';
  });
};


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!customizeItem) {
    return <div>Customize item not found</div>;
  }

  return (
    <div className="customize-container" id="customize-details">
      <div className="header-section">
        <h2>Customize Item Details</h2>
        <button className="pdf-button" onClick={generatePDF}>
      <i className="fas fa-file-pdf"></i> Download PDF
    </button>

      </div>

      <div className="details-section">
        <div className="detail-row">
          <div className="detail-label">ID:</div>
          <div className="detail-value">{customizeItem._id}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Layers:</div>
          <div className="detail-value">{customizeItem.custom_layers}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Size:</div>
          <div className="detail-value">{customizeItem.custom_size}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Shape:</div>
          <div className="detail-value">{customizeItem.custom_shape}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Bases:</div>
          <div className="detail-value">
            <ul>
              {customizeItem.custom_bases?.map((base, index) => (
                <li key={index}>{base.option_flavor} (Rs.{base.option_price})</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Fillings:</div>
          <div className="detail-value">
            <ul>
              {customizeItem.custom_filling?.map((filling, index) => (
                <li key={index}>{filling.option_flavor} (Rs.{filling.option_price})</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Frosting:</div>
          <div className="detail-value">
            {customizeItem.custom_frosting ? 
              `${customizeItem.custom_frosting.option_flavor} (${customizeItem.custom_frosting.option_price})` :
              'No frosting selected'}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Total Price:</div>
          <div className="detail-value">Rs.{customizeItem.custom_price}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Specifications:</div>
          <div className="detail-value">
            {customizeItem.custom_specifications || 'No specifications'}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Last Updated:</div>
          <div className="detail-value">{new Date(customizeItem.last_updated_At).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomize;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cake_cards from './Cake_cards';
import './Cake_list.css';

const Cakes = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/product/get')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="cakes-page">
      <h1 className="cakes-page-title">Our Cakes</h1>
      <p className="cakes-page-sub">Handcrafted with love — find your perfect slice</p>
      {loading ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'#a07070', fontWeight:600 }}>Loading cakes…</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'#a07070', fontWeight:600 }}>No cakes found!</div>
      ) : (
        <div className="list">
          {products.map((p, i) => <Cake_cards key={i} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Cakes;

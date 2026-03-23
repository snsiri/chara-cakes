import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InsertProduct.css";
import { Link } from 'react-router-dom';

const InsertProduct = () => {
  const [ingredients, setIngredients] = useState([]);
  const [initialIngredients, setInitialIngredients] = useState([]);
  const [productData, setProductData] = useState({
    product_name: "",
    product_weight: "",
    product_description: "",
    product_price: "",
    flavor: "",
    occasion: "",
    specifications: "",
    imageSource: "upload",
    product_image_url: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/ingredients/")
      .then((response) => {
        const loaded = response.data.map((item) => ({
          _id: item._id, name: item.name, unit: item.unit, quantity: 0,
        }));
        setIngredients(loaded);
        setInitialIngredients(loaded);
      })
      .catch(() => setError("Failed to load ingredients."));
  }, []);

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index].quantity = value === "" ? "" : Number(value);
    setIngredients(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => setProductImage(e.target.files[0]);

  const handleSourceChange = (e) => {
    setProductData({ ...productData, imageSource: e.target.value, product_image_url: "" });
    setProductImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(""); setError("");
    const formData = new FormData();
    formData.append("product_name", productData.product_name);
    formData.append("product_weight", productData.product_weight);
    formData.append("product_description", productData.product_description);
    formData.append("product_price", productData.product_price);
    formData.append("flavor", productData.flavor);
    formData.append("occasion", productData.occasion);
    formData.append("specifications", productData.specifications);
    formData.append("ingredients", JSON.stringify(ingredients));
    if (productData.imageSource === "upload" && productImage) {
      formData.append("product_image", productImage);
    } else if (productData.imageSource === "url" && productData.product_image_url) {
      formData.append("product_image_url", productData.product_image_url);
    }
    axios.post("http://localhost:3000/api/product/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        setSuccess("Product added successfully!");
        setProductData({ product_name:"",product_weight:"",product_description:"",product_price:"",flavor:"",occasion:"",specifications:"",imageSource:"upload",product_image_url:"" });
        setProductImage(null);
        setIngredients(initialIngredients.map(i => ({ ...i, quantity: 0 })));
      })
      .catch(() => setError("Failed to add product. Please check your input."));
  };

  const OCCASION_OPTIONS = ["Birthday","Wedding","Anniversary","Graduation","Baby Shower","Christmas","Valentine's Day"];
  const SPECIFICATION_OPTIONS = ["Eggless","Sugar-free","Gluten-free","Vegan","Nut-free","Low-calorie"];

  return (
    <div className="insert-product-page">
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin/manage-products" style={{ color: '#f97b7b', fontWeight: 700, textDecoration: 'none' }}>
          ← Go Back
        </Link>
      </div>
      <h2>Add New Product</h2>
      <form className="insert-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Product Name</label>
          <input type="text" name="product_name" value={productData.product_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Product Weight</label>
          <input type="text" name="product_weight" value={productData.product_weight} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="product_description" value={productData.product_description} onChange={handleChange} required rows={3} />
        </div>
        <div className="form-group">
          <label>Price (Rs.)</label>
          <input type="number" name="product_price" step="0.01" value={productData.product_price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Flavors <span className="hint">(comma separated)</span></label>
          <input type="text" name="flavor" value={productData.flavor} onChange={handleChange} placeholder="e.g. Chocolate, Vanilla" required />
        </div>
        <div className="form-group">
          <label>Occasions</label>
          <select name="occasion" multiple value={productData.occasion ? productData.occasion.split(",").map(s=>s.trim()) : []}
            onChange={e => { const sel = Array.from(e.target.selectedOptions, o=>o.value); setProductData({...productData, occasion: sel.join(", ")}); }}>
            {OCCASION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <small style={{color:'#c08080',fontSize:'0.75rem'}}>Hold Ctrl / Cmd to select multiple</small>
        </div>
        <div className="form-group">
          <label>Specifications</label>
          <select name="specifications" multiple value={productData.specifications ? productData.specifications.split(",").map(s=>s.trim()) : []}
            onChange={e => { const sel = Array.from(e.target.selectedOptions, o=>o.value); setProductData({...productData, specifications: sel.join(", ")}); }}>
            {SPECIFICATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Image Source</label>
          <div style={{ display:'flex', gap:20, marginTop:6 }}>
            <label style={{ textTransform:'none', fontWeight:500, display:'flex', alignItems:'center', gap:6 }}>
              <input type="radio" name="imageSource" value="upload" checked={productData.imageSource==="upload"} onChange={handleSourceChange} style={{width:'auto'}} /> Upload
            </label>
            <label style={{ textTransform:'none', fontWeight:500, display:'flex', alignItems:'center', gap:6 }}>
              <input type="radio" name="imageSource" value="url" checked={productData.imageSource==="url"} onChange={handleSourceChange} style={{width:'auto'}} /> URL
            </label>
          </div>
        </div>
        {productData.imageSource === "upload" ? (
          <div className="form-group">
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
          </div>
        ) : (
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="product_image_url" value={productData.product_image_url} onChange={handleChange} required />
          </div>
        )}
        <div className="form-group">
          <label>Ingredients</label>
          {ingredients.length === 0 ? <div>Loading…</div> : ingredients.map((ing, i) => (
            <div key={i} className="ingredient-row">
              <input type="text" value={ing.name} readOnly style={{ flex:2 }} />
              <input type="number" placeholder="Qty" value={ing.quantity} onChange={e=>handleIngredientChange(i,e.target.value)} min="0" step="any" style={{ flex:1 }} />
              <input type="text" value={ing.unit} readOnly style={{ flex:1 }} />
            </div>
          ))}
        </div>
        <button type="submit" className="submit-btn">Add Product</button>
        {success && <div className="success-msg">{success}</div>}
        {error   && <div className="error-msg">{error}</div>}
      </form>
    </div>
  );
};

export default InsertProduct;

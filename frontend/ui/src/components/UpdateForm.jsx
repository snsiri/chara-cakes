import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Alert, Row, Col, Card } from "react-bootstrap";



const OCCASION_OPTIONS = [
  "Birthday", "Wedding", "Anniversary", "Graduation", "Baby Shower", "Christmas", "Valentine's Day"
];

const SPECIFICATION_OPTIONS = [
  "Eggless", "Sugar-free", "Gluten-free", "Vegan", "Nut-free", "Low-calorie"
];

const UpdateForm = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageSource, setImageSource] = useState("upload");
  const [productIngredients, setProductIngredients] = useState([]);
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/get');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to fetch products. Please try again later.');
    }
  };

  const openUpdateModal = (product) => {
    setCurrentProduct(product);
    const { flavor = [], occasion = [], specifications = [] } = product.product_category || {};
    setUpdatedData({
      product_name: product.product_name,
      product_weight: product.product_weight,
      product_description: product.product_description,
      product_price: product.product_price,
      flavor: flavor.join(", "),
      occasion: occasion.join(", "),
      specifications: specifications.join(", "),
      product_image_url: product.product_image_url
    });
    setProductIngredients(product.ingredients || []);
    setImageSource("upload");
    setProductImage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setUpdatedData({});
    setProductIngredients([]);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleInputChange = (field, value) => {
    setUpdatedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOccasionChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setUpdatedData(prev => ({
      ...prev,
      occasion: selected.join(",")
    }));
  };

  const handleSpecificationChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setUpdatedData(prev => ({
      ...prev,
      specifications: selected.join(",")
    }));
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...productIngredients];
    updated[index].quantity = value === "" ? "" : Number(value);
    setProductIngredients(updated);
  };

  const handleSourceChange = (e) => {
    setImageSource(e.target.value);
    setProductImage(null);
    setUpdatedData(prev => ({ ...prev, product_image_url: "" }));
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!updatedData.product_name || !updatedData.product_weight || !updatedData.product_price) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_name", updatedData.product_name);
      formData.append("product_weight", updatedData.product_weight);
      formData.append("product_description", updatedData.product_description);
      formData.append("product_price", updatedData.product_price);
      formData.append("flavor", updatedData.flavor);
      formData.append("occasion", updatedData.occasion);
      formData.append("specifications", updatedData.specifications);
      formData.append("ingredients", JSON.stringify(productIngredients));
      formData.append("lastUpdated", new Date().toISOString());

      if (imageSource === "upload" && productImage) {
        formData.append("product_image", productImage);
      } else if (imageSource === "url" && updatedData.product_image_url) {
        formData.append("product_image_url", updatedData.product_image_url);
      }

      await axios.put(`http://localhost:3000/api/product/update/${currentProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage('Product updated successfully!');
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product. Please try again later.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/product/delete/${id}`);
      setSuccessMessage('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product. Please try again later.');
    }
  };

  // return (
  //   <Container className="py-4">
  //     <h2 className="text-center mb-4">Manage Cake Products</h2>
  //     {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
  //     {errorMessage && <Alert variant="danger" className="mb-3">{errorMessage}</Alert>}
  //     <Row xs={1} md={2} lg={3} className="g-4">
  //       {products.length === 0 ? (
  //         <Col>
  //           <Alert variant="info">No cakes found!</Alert>
  //         </Col>
  //       ) : (
  //         products.map((product, index) => (
  //           <Col key={index}>
  //             <Card className="h-100 product-card">
  //               <Card.Body>
  //                 <h5>{product.product_name}</h5>
  //                 <p><b>Price:</b> ${product.product_price}</p>
  //                 <p><b>Weight:</b> {product.product_weight}</p>
  //                 <p><b>Flavors:</b> {(product.product_category?.flavor || []).join(", ")}</p>
  //                 <p><b>Occasions:</b> {(product.product_category?.occasion || []).join(", ")}</p>
  //                 <p><b>Specifications:</b> {(product.product_category?.specifications || []).join(", ")}</p>
  //                 <div className="d-flex justify-content-between mt-3">
  //                   <Button variant="primary" onClick={() => openUpdateModal(product)}>Edit</Button>
  //                   <Button
  //                     variant="danger"
  //                     onClick={() => {
  //                       if (window.confirm("Are you sure you want to delete this product?")) {
  //                         handleDelete(product._id);
  //                       }
  //                     }}
  //                   >
  //                     Delete
  //                   </Button>
  //                 </div>
  //               </Card.Body>
  //             </Card>
  //           </Col>
  //         ))
  //       )}
  //     </Row>
  //     <Modal show={showModal} onHide={closeModal} centered size="lg" className="update-modal">
  //       <Modal.Header closeButton>
  //         <Modal.Title>Update Cake Product</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         {currentProduct && (
  //           <Form>
  //             <div className="form-grid">
  //               <Form.Group className="mb-3">
  //                 <Form.Label>Product Name</Form.Label>
  //                 <Form.Control
  //                   type="text"
  //                   value={updatedData.product_name || ''}
  //                   onChange={e => handleInputChange('product_name', e.target.value)}
  //                   required
  //                   placeholder="Enter product name"
  //                 />
  //               </Form.Group>
  //               <Form.Group className="mb-3">
  //                 <Form.Label>Product Weight</Form.Label>
  //                 <Form.Control
  //                   type="text"
  //                   value={updatedData.product_weight || ''}
  //                   onChange={e => handleInputChange('product_weight', e.target.value)}
  //                   required
  //                   placeholder="Enter weight (e.g., 500g, 1kg)"
  //                 />
  //               </Form.Group>
  //             </div>
  //             <Form.Group className="mb-3">
  //               <Form.Label>Product Description</Form.Label>
  //               <Form.Control
  //                 as="textarea"
  //                 rows={3}
  //                 value={updatedData.product_description || ''}
  //                 onChange={e => handleInputChange('product_description', e.target.value)}
  //                 required
  //                 placeholder="Enter product description"
  //               />
  //             </Form.Group>
  //             <Form.Group className="mb-3">
  //               <Form.Label>Product Price</Form.Label>
  //               <Form.Control
  //                 type="number"
  //                 step="0.01"
  //                 value={updatedData.product_price || ''}
  //                 onChange={e => handleInputChange('product_price', e.target.value)}
  //                 required
  //                 placeholder="Enter price"
  //               />
  //             </Form.Group>
  //             <Form.Group className="mb-3">
  //               <Form.Label>Flavor</Form.Label>
  //               <Form.Control
  //                 type="text"
  //                 value={updatedData.flavor || ''}
  //                 onChange={e => handleInputChange('flavor', e.target.value)}
  //                 placeholder="Enter flavors separated by commas (e.g., chocolate, vanilla)"
  //               />
  //             </Form.Group>
  //             <Form.Group className="mb-3">
  //               <Form.Label>Occasion</Form.Label>
  //               <Form.Select
  //                 multiple
  //                 value={updatedData.occasion ? updatedData.occasion.split(',') : []}
  //                 onChange={handleOccasionChange}
  //                 title="Select occasions"
  //               >
  //                 {OCCASION_OPTIONS.map((option) => (
  //                   <option key={option} value={option}>{option}</option>
  //                 ))}
  //               </Form.Select>
  //             </Form.Group>
  //             <Form.Group className="mb-3">
  //               <Form.Label>Specifications</Form.Label>
  //               <Form.Select
  //                 multiple
  //                 value={updatedData.specifications ? updatedData.specifications.split(',') : []}
  //                 onChange={handleSpecificationChange}
  //                 title="Select specifications"
  //               >
  //                 {SPECIFICATION_OPTIONS.map((option) => (
  //                   <option key={option} value={option}>{option}</option>
  //                 ))}
  //               </Form.Select>
  //             </Form.Group>
  //             <Form.Group className="mb-3">
  //               <Form.Label>Ingredients</Form.Label>
  //               {productIngredients.map((ingredient, index) => (
  //                 <div key={index} className="ingredient-input-group">
  //                   <Form.Label>Ingredient {index + 1}</Form.Label>
  //                   <div className="d-flex gap-2">
  //                     <Form.Control
  //                       type="text"
  //                       value={ingredient.name || ''}
  //                       onChange={(e) => handleIngredientChange(index, e.target.value)}
  //                       placeholder="Ingredient name"
  //                       style={{ flex: 1 }}
  //                     />
  //                     <Form.Control
  //                       type="number"
  //                       value={ingredient.quantity || ''}
  //                       onChange={(e) => handleIngredientChange(index, e.target.value)}
  //                       placeholder="Quantity"
  //                       style={{ flex: 0.5 }}
  //                     />
  //                   </div>
  //                 </div>
  //               ))}
  //             </Form.Group>
  //             <Form.Group className="mb-3">
  //               <Form.Label>Image Source</Form.Label>
  //               <div className="d-flex gap-2">
  //                 <Form.Check
  //                   type="radio"
  //                   label="Upload Image"
  //                   name="imageSource"
  //                   value="upload"
  //                   checked={imageSource === "upload"}
  //                   onChange={handleSourceChange}
  //                 />
  //                 <Form.Check
  //                   type="radio"
  //                   label="Use URL"
  //                   name="imageSource"
  //                   value="url"
  //                   checked={imageSource === "url"}
  //                   onChange={handleSourceChange}
  //                 />
  //               </div>
  //             </Form.Group>
  //             {imageSource === "upload" ? (
  //               <Form.Group className="mb-3">
  //                 <Form.Label>Upload Image</Form.Label>
  //                 <Form.Control
  //                   type="file"
  //                   accept="image/*"
  //                   onChange={handleFileChange}
  //                   className="custom-file-input"
  //                 />
  //               </Form.Group>
  //             ) : (
  //               <Form.Group className="mb-3">
  //                 <Form.Label>Image URL</Form.Label>
  //                 <Form.Control
  //                   type="url"
  //                   value={updatedData.product_image_url || ''}
  //                   onChange={e => handleInputChange('product_image_url', e.target.value)}
  //                   placeholder="Enter image URL"
  //                 />
  //               </Form.Group>
  //             )}
  //             <div className="d-flex justify-content-end">
  //               <Button 
  //                 variant="primary" 
  //                 onClick={handleUpdate}
  //                 disabled={!updatedData.product_name || !updatedData.product_weight || !updatedData.product_price}
  //               >
  //                 <i className="bi bi-save me-1"></i>Update Product
  //               </Button>
  //             </div>
  //           </Form>
  //         )}
  //       </Modal.Body>
  //     </Modal>
  //   </Container>
  // );
// };
}

export default UpdateForm;

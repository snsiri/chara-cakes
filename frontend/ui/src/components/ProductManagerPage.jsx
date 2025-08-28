import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProductManagerPage.css';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Table } from 'react-bootstrap';

const OCCASION_OPTIONS = [
  "Birthday", "Wedding", "Anniversary", "Graduation", "Baby Shower", "Christmas", "Valentine's Day"
];

const SPECIFICATION_OPTIONS = [
  "Eggless", "Sugar-free", "Gluten-free", "Vegan", "Nut-free", "Low-calorie"
];

function ProductManagerPage() {
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

  // const handleIngredientChange = (index, value) => {
  //   const updated = [...productIngredients];
  //   updated[index].quantity = value === "" ? "" : Number(value);
  //   setProductIngredients(updated);
  // };

  const handleIngredientNameChange = (index, value) => {
  const updated = [...productIngredients];
  updated[index].name = value;
  setProductIngredients(updated);
};

const handleIngredientQuantityChange = (index, value) => {
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
      formData.append("product_id", currentProduct._id);
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
      const productResponse = await axios.get(`http://localhost:3000/api/product/get/${id}`);
      const product = productResponse.data.Product;

      const confirmDelete = window.confirm(
        `Are you sure you want to delete this product?\n\n` +
        `Name: ${product.product_name}\n` +
        `Weight: ${product.product_weight}\n` +
        `Price: ${product.product_price}\n` +
        `Flavors: ${(product.product_category?.flavor || []).join(', ')}\n` +
        `Occasions: ${(product.product_category?.occasion || []).join(', ')}\n` +
        `Specifications: ${(product.product_category?.specifications || []).join(', ')}`
      );

      if (!confirmDelete) {
        return;
      }

      await axios.delete(`http://localhost:3000/api/product/delete/${id}`);
      setSuccessMessage('Product deleted successfully and moved to discontinued products!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Product Management</h2>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* Add Product Button */}
      <div className="flex justify-center mb-8">
        <Col xs="auto">
          <Link to="/admin/discontinued">
            <Button className="nbtn"variant="success">Discontinued Products</Button>
          </Link>
        </Col>
        <Col xs="auto">
          <Link to="/admin/insert_product">
            <Button className="nbtn"variant="success">Add New Product</Button>
          </Link>
        </Col>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md mb-6">
       
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flavors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occasions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{product.product_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.product_weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-sm overflow-hidden">
                      {product.ingredients?.map((ingredient, index) => (
                        <div key={index} className="flex items-center mb-1">
                          <span className="text-sm text-gray-700">{ingredient.name}</span>
                          <span className="ml-2 text-sm text-gray-600">({ingredient.quantity} {ingredient.unit})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(product.product_category?.flavor || []).join(", ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(product.product_category?.occasion || []).join(", ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(product.product_category?.specifications || []).join(", ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="pbtn"
                      onClick={() => openUpdateModal(product)}
                    >
                      <i className="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button
                      className="prbtn"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this product?")) {
                          handleDelete(product._id);
                        }
                      }}
                    >
                      <i className="fas fa-trash mr-1"></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex flex-row justify-between items-center pb-3">
              <h3 className="text-2xl font-bold">Update Product</h3>
              <button
                onClick={closeModal}
                className="bg-transparent hover:bg-gray-200 text-gray-600 font-semibold hover:text-gray-800 py-2 px-4 border border-gray-300 hover:border-transparent rounded"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-6">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={updatedData.product_name || ''}
                      onChange={e => handleInputChange('product_name', e.target.value)}
                      required
                      placeholder="Enter product name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Product Weight
                    </label>
                    <input
                      type="text"
                      value={updatedData.product_weight || ''}
                      onChange={e => handleInputChange('product_weight', e.target.value)}
                      required
                      placeholder="Enter weight (e.g., 500g, 1kg)"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={updatedData.product_description || ''}
                    onChange={e => handleInputChange('product_description', e.target.value)}
                    required
                    placeholder="Enter product description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Product Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={updatedData.product_price || ''}
                    onChange={e => handleInputChange('product_price', e.target.value)}
                    required
                    placeholder="Enter price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Flavor
                  </label>
                  <input
                    type="text"
                    value={updatedData.flavor || ''}
                    onChange={e => handleInputChange('flavor', e.target.value)}
                    placeholder="Enter flavors separated by commas (e.g., chocolate, vanilla)"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Occasion
                  </label>
                  <select
                    multiple
                    value={updatedData.occasion ? updatedData.occasion.split(',') : []}
                    onChange={handleOccasionChange}
                    title="Select occasions"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {OCCASION_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Specifications
                  </label>
                  <select
                    multiple
                    value={updatedData.specifications ? updatedData.specifications.split(',') : []}
                    onChange={handleSpecificationChange}
                    title="Select specifications"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {SPECIFICATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ingredients
                  </label>
                  {productIngredients.map((ingredient, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Ingredient {index + 1}
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={ingredient.name || ''}
                          onChange={(e) => handleIngredientNameChange(index, e.target.value)}
                        />
                        <input
                          type="number"
                          value={ingredient.quantity || ''}
                          onChange={(e) => handleIngredientQuantityChange(index, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image Source
                  </label>
                  <div className="flex gap-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="imageSource"
                        value="upload"
                        checked={imageSource === "upload"}
                        onChange={handleSourceChange}
                        className="mr-2"
                      />
                      Upload Image
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="imageSource"
                        value="url"
                        checked={imageSource === "url"}
                        onChange={handleSourceChange}
                        className="mr-2"
                      />
                      Use URL
                    </label>
                  </div>
                </div>
                {imageSource === "upload" ? (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={updatedData.product_image_url || ''}
                      onChange={e => handleInputChange('product_image_url', e.target.value)}
                      placeholder="Enter image URL"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                )}
              </form>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagerPage;

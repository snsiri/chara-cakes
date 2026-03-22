import express from 'express';
const router = express.Router();
import Product from '../models/Product.js';
import Ingredient from '../models/IngredientStock.js';
import Discontinued_product from '../models/discontinued_product.js';
import getNextSequenceValue from '../utils/sequence.js';
const prefix = "OGC-";
import multer from 'multer';
import path from 'path';




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});


// Get all products
// router.get("/get", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

http://localhost:3000/api/product/add
router.route("/add").post(upload.single("product_image"), async (req, res) => {
    try {
      const {
        
        product_name,
        product_weight,
        product_description,
        product_price,
        flavor,
        occasion,
        specifications,
        product_image_url,
        ingredients, // <- added here
      } = req.body;
  
      const parsedIngredients = JSON.parse(ingredients);
  
      let product_image = "";
      if (req.file) {
        product_image = req.file.path;
      } else if (product_image_url) {
        product_image = product_image_url;
      }
  
      const sequenceName = "productid";
      const newId = await getNextSequenceValue(prefix, sequenceName);
  
      const newProduct = new Product({
        _id: newId,
        
        product_name,
        product_weight,
        product_description,
        product_price,
        product_category: {
          flavor,
          occasion,
          specifications,
        },
        product_image,
        ingredients: parsedIngredients,
        last_updated_At: new Date()
      });
  
      await newProduct.save();
  
      // Update stock
      for (const item of parsedIngredients) {
        await Ingredient.findByIdAndUpdate(
          item.ingredientId,
          { $inc: { stock: -item.amount } },
          { new: true }
        );
      }
  
      res.status(201).json({ status: "Product added successfully", Product: newProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Error adding product", error: err.message });
    }
  });
  


http://localhost:3000/api/product

router.route("/get").get(async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error fetching products", error: err.message });
    }
});


http://localhost:3000/api/product/update/crntpdct

router.route("/update/:product_id").put(upload.single("product_image"), async (req, res) => {
  try {
    const id = req.params.product_id;

    // Parse product_ingredients if it's a string
    let ingredients = [];
    if (req.body.ingredients) {
      if (typeof req.body.ingredients === "string") {
        ingredients = JSON.parse(req.body.ingredients);
      } else {
        ingredients = req.body.ingredients;
      }
    }

    // Parse flavor, occasion, specifications
    const flavor = req.body.flavor ? req.body.flavor.split(",").map(s => s.trim()).filter(Boolean) : [];
    const occasion = req.body.occasion ? req.body.occasion.split(",").map(s => s.trim()).filter(Boolean) : [];
    const specifications = req.body.specifications ? req.body.specifications.split(",").map(s => s.trim()).filter(Boolean) : [];

    // Handle image (file or URL)
    let product_image = req.body.product_image_url || "";
    if (req.file) {
      product_image = req.file.path;
    }

    const updateProduct = {
      product_name: req.body.product_name,
      product_weight: req.body.product_weight,
      product_description: req.body.product_description,
      product_price: req.body.product_price,
      product_category: {
        flavor,
        occasion,
        specifications
      },
      product_image,
      ingredients,
      last_updated_At: new Date()
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateProduct, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ status: "Product not found" });
    }

    res.status(200).json({ status: "Product Updated successfully", Product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error updating product", error: err.message });
  }
});


http://localhost:3000/api/product/delete/crntpdcts

router.route("/delete/:product_id").delete(async (req, res) => {
    try {
        const id = req.params.product_id;

        const discontinued = await Product.findById(id);
        if (!discontinued) {
            return res.status(404).json({ status: "Product not found" });
        }

        // Create discontinued product with minimal validation
        const discontinued_product = new Discontinued_product({
            _id: discontinued._id,
            discontinued_product_name: discontinued.product_name,
            discontinued_product_weight: discontinued.product_weight || '',
            discontinued_product_description: discontinued.product_description || '',
            discontinued_product_price: String(discontinued.product_price || ''),
            discontinued_product_category: {
                discontinued_flavor: discontinued.product_category?.flavor || [],
                discontinued_occasion: discontinued.product_category?.occasion || [],
                discontinued_specifications: discontinued.product_category?.specifications || []
            },
            discontinued_product_image: discontinued.product_image || '',
            discontinued_ingredients: discontinued.ingredients || [],
            deletedAt: new Date()
        });

        await discontinued_product.save();
        await Product.findByIdAndDelete(id);

        res.status(200).json({ status: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error deleting product", error: err.message });
    }
});

http://localhost:3000/api/product/get/crntpdcts

router.route("/get/:product_id").get(async (req, res) => {
    try {
        const id = req.params.product_id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ status: "Product not found" });
        }

        res.status(200).json({ status: "Product fetched", Product: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error fetching product", error: err.message });
    }
});

http://localhost:3000/api/product/search?q=apple

router.route("/search").get(async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ status: "Query parameter 'q' is required" });
        }

        // Build $or array
        const orArray = [
            { _id: { $regex: q, $options: "i" } },
            { product_name: { $regex: q, $options: "i" } },
            { "product_category.flavor": { $regex: q, $options: "i" } },
            { "product_category.occasion": { $regex: q, $options: "i" } },
            { "product_category.specifications": { $regex: q, $options: "i" } }
        ];

        // If q is a number, also search product_price
        if (!isNaN(q)) {
            orArray.push({ product_price: Number(q) });
        }

        const products = await Product.find({ $or: orArray });

        res.status(200).json({ status: "Search results", products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error searching products", error: err.message });
    }
});

http://localhost:3000/api/product/occasion?occasion=wedding

router.get('/occasion', async (req, res) => {
  const { occasion } = req.query;

  if (!occasion) {
    return res.status(400).json({ message: 'Occasion query is required' });
  }

  const occasionArray = occasion.split(','); // fix here

  try {
    const products = await Product.find({
      'product_category.occasion': { $in: occasionArray }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.get('/occasion', async (req, res) => {
//   let { occasion } = req.query;

//   if (!occasion) {
//     return res.status(400).json({ message: 'Occasion query is required' });
//   }

// const occasionQuery = req.query.occasion.split(','); // split comma-separated list

//   try {
//     const products = await Product.find({
//       'product_category.occasion': { $in: occasionQuery  }
//     });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/occasion', async (req, res) => {
//   try {
//     const occasionQuery = req.query.occasion;

//     let filter = {};

//     if (occasionQuery) {
//       // Split comma-separated values into an array
//       const occasions = occasionQuery.split(',').map(o => o.trim());

//       // Match any product where occasion array includes any of the values
//       filter['product_category.occasion'] = { $in: occasions };
//     }

//     const products = await Product.find(filter);
//     res.status(200).json(products);
//   } catch (err) {
//     console.error('Error fetching products:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

export default router;
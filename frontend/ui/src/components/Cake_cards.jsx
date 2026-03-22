import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// const Cake_cards = ({ product }) => {
//   return (
//     <Link to={`/cake/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//       <Card sx={{ maxWidth: 345 }}>
//         <CardActionArea>
//           <CardMedia
//             component="img"
//             height="140"
//             image={product.image}
//             alt="Cake"
//           />
//           <CardContent>
//             <Typography gutterBottom variant="h5" component="div">
//               {product?.product_name}
//             </Typography>
//             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//               {product?.product_description}
//               <br />
//               ${product?.product_price}
//             </Typography>
//           </CardContent>
//         </CardActionArea>
//         <CardActions>
//           {/* <Button size="small" color="primary">Delete</Button>
//           <Button size="small" color="primary">Update</Button> */}
//         </CardActions>
//       </Card>
//     </Link>
//   );
// };

const Cake_cards = ({ product }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = React.useState(false);

  const handleClick = () => {
    navigate(`/cakes/${product._id}`);
  };

  const addToWishlist = async (e) => {
    // stop card click
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      // adjust endpoint as needed
      await axios.post("http://localhost:3000/api/wishlist/add", {
        productId: product._id,
      });
      alert("Added to wishlist");
    } catch (err) {
      console.error(err);
      alert("Could not add to wishlist");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="cake-card" onClick={handleClick}>
      {product.product_image ? (
        <img
          src={product.product_image}
          alt={product.product_name}
          className="cake-image"
        />
      ) : (
        <div className="no-image">No Image Available</div>
      )}

      <button
        className="wishlist-btn"
        onClick={addToWishlist}
        disabled={adding}
      >
        {adding ? "Adding..." : "♥"}
      </button>

      <div className="cake-info">
        <h3>{product.product_name}</h3>
        <p>Rs.{product.product_price}</p>
      </div>
    </div>
  );
};

export default Cake_cards;

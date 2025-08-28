import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const slides = [
  {
    title: "Chara Cakes",
    subtitle: "Bite in to Bliss...",
    image: "https://images.unsplash.com/photo-1624240383807-464f369e4b1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGJpcnRoZGF5JTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    title: "Chara Wedding Cakes",
    subtitle: "Your dream Wedding cakes made real...",
    image: "https://media.istockphoto.com/id/1128666848/photo/wedding-cakewedding-cake-flower-cake-sweet-food-celebration-event.jpg?s=2048x2048&w=is&k=20&c=6VCIF05y1ZhenvBKjP6e39lOx3M8tkOCUzX2gfoGVaI="
  },
  {
    title: "Chara Birthday Cakes",
    subtitle: "Happyness in every crumb..",
    image: "https://plus.unsplash.com/premium_photo-1677221924410-0d27f4940396?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];
const occasions = ['Wedding', 'Birthday', 'Anniversary'];

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 10000,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: { slidesToShow: 1 }
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 }
    }
  ]
};


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [productsByOccasion, setProductsByOccasion] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleClick = (id) => {
  navigate(`/cakes/${id}`);
};

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

useEffect(() => {
  const fetchProducts = async () => {
    const results = {};
    for (const occasion of occasions) {
      try {
        const res = await fetch(`/api/product/occasion?occasion=${occasion}`);
        if (!res.ok) throw new Error(`Failed to fetch ${occasion}`);
        const data = await res.json();
        results[occasion] = data;
      } catch (err) {
        console.error(`Error fetching ${occasion} cakes:`, err);
        results[occasion] = [];
      }
    }
    setProductsByOccasion(results);
    setLoading(false);
  };

  fetchProducts();
}, []);
if (loading) {
  return <div className="loading">Loading all cakes...</div>;
}


  return (
    <div className="home">
      <section className="hero" 
      style={{
    backgroundImage: `url(${slides[currentSlide].image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
  >
  <div className="hero-slider">
    <div
      className="hero-slider-track"
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {slides.map((slide, index) => (
        <div className= {`hero-content ${index === currentSlide ? 'active' : ''}`}key={index}>
          <div className="hero-text">
            <h1 className="fancy-text">{slide.title}</h1>
            <p className="fancy-text1">{slide.subtitle}</p>
            <Link to="/cakes" className="order-button">Order Now</Link>
          </div>
          
        </div>
      ))}
    </div>

    <div className="slider-dots">
      {slides.map((_, index) => (
        <button
          key={index}
          className={`dot ${index === currentSlide ? 'active' : ''}`}
          onClick={() => setCurrentSlide(index)}
        />
      ))}
    </div>
  </div>
</section>

      {/* Dynamic Carousels by Occasion */}
      {occasions.map((occasion) => (
  <div key={occasion} className="cakes-section">
    <div className="cakes-header">
      <h2>{occasion} Cakes</h2>
      <Link to={`/cakes?occasion=${occasion}`} className="view-all">View All ➤</Link>
        </div>

        {productsByOccasion[occasion] ? (
          productsByOccasion[occasion].length > 0 ? (
            <Slider {...sliderSettings}>
              {productsByOccasion[occasion].map((product) => (
                <Link to={`/cakes/${product._id}`} key={product._id} className="cake-card1">
      <img src={product.product_image} alt={product.product_name} className="cake-image" />
      <div className="cake-info1">
        <h3>{product.product_name}</h3>
        <p className="cake-price">Rs. {product.product_price}</p>
      </div>
    </Link>

          ))}
        </Slider>
      ) : (
        <p>No cakes available for {occasion}</p>
      )
    ) : (
      <p>Loading {occasion} cakes...</p>
    )}
  </div>
))}


 

      {/* Customize Section */}
      <section className="customize-section">
        <Link to="/customizes" className="customize-button">Customize Your Cake</Link>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from './Footer';

const slides = [
  {
    eyebrow: 'Handcrafted with love',
    title: <>Bite into <em>Bliss</em></>,
    subtitle: 'Freshly baked cakes for every occasion, made to order across Sri Lanka.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&auto=format&fit=crop&q=80'
  },
  {
    eyebrow: 'Celebrate your big day',
    title: <>Dream Wedding <em>Cakes</em></>,
    subtitle: 'Elegant, towering creations as beautiful as your love story.',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1600&auto=format&fit=crop&q=80'
  },
  {
    eyebrow: 'Make it unforgettable',
    title: <>Birthday <em>Magic</em></>,
    subtitle: 'Happiness in every crumb — surprise someone special today.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1600&auto=format&fit=crop&q=80'
  }
];

const occasions = ['Wedding', 'Birthday', 'Anniversary'];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3800,
  responsive: [
    { breakpoint: 1100, settings: { slidesToShow: 2 } },
    { breakpoint: 680,  settings: { slidesToShow: 1 } }
  ]
};

const features = [
  { icon: '🎂', text: 'Made to Order' },
  { icon: '🚚', text: 'Island-Wide Delivery' },
  { icon: '✨', text: '100% Fresh Ingredients' },
  { icon: '💌', text: 'Custom Designs' },
];

const Home = ({ customer, error: propError }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productsByOccasion, setProductsByOccasion] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const results = {};
      for (const occasion of occasions) {
        try {
          const res = await fetch(`/api/product/occasion?occasion=${occasion}`);
          results[occasion] = res.ok ? await res.json() : [];
        } catch {
          results[occasion] = [];
        }
      }
      setProductsByOccasion(results);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading cakes…</div>;

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-bg-slide ${i === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        <div className="hero-slider">
          <div className="hero-content">
            <p className="hero-eyebrow">{slides[currentSlide].eyebrow}</p>
            <div className="hero-text">
              <h1>{slides[currentSlide].title}</h1>
              <p>{slides[currentSlide].subtitle}</p>
            </div>
            <div className="hero-cta-row">
              <Link to="/cakes" className="order-button">Order Now</Link>
              <Link to="/customizes" className="order-button-ghost">Customize Yours</Link>
            </div>
          </div>
        </div>

        <div className="slider-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)} />
          ))}
        </div>

        <div className="hero-scroll-hint">Scroll to explore</div>
      </section>

      {/* ── FEATURE STRIP ── */}
      <div className="feature-strip">
        {features.map(f => (
          <div className="feature-item" key={f.text}>
            <div className="feature-icon">{f.icon}</div>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      {/* ── OCCASION CAROUSELS ── */}
      {occasions.map(occasion => (
        <div key={occasion} className="cakes-section">
          <div className="section-wrap">
            <div className="section-header">
              <div>
                <p className="section-label">Fresh Collection</p>
                <h2 className="section-title">{occasion} Cakes</h2>
              </div>
              <Link to={`/cakes?occasion=${occasion}`} className="view-all">View All →</Link>
            </div>

            {productsByOccasion[occasion]?.length > 0 ? (
              <Slider {...sliderSettings}>
                {productsByOccasion[occasion].map(product => (
                  <Link to={`/cakes/${product._id}`} key={product._id} className="cake-card1">
                    <img src={product.product_image} alt={product.product_name}
                      onError={e => { e.target.style.background = '#fde8e8'; e.target.src = ''; }} />
                    <div className="cake-info1">
                      <h3>{product.product_name}</h3>
                      <p className="cake-price">Rs. {product.product_price}</p>
                    </div>
                  </Link>
                ))}
              </Slider>
            ) : (
              <p style={{ color:'#a07070', fontWeight:600, fontFamily:'Quicksand, sans-serif' }}>
                No {occasion} cakes available right now.
              </p>
            )}
          </div>
        </div>
      ))}

      {/* ── CUSTOMIZE BANNER ── */}
      <section className="customize-section">
        <h2>Can't find what you're looking for?</h2>
        <p>Design your dream cake — choose every layer, filling &amp; decoration.</p>
        <Link to="/customizes" className="customize-button">Customize Your Cake</Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

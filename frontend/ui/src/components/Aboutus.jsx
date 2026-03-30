import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const AboutUs = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

      .au-page { font-family: 'Quicksand', sans-serif; background: #fff; overflow-x: hidden; }

      /* Hero */
      .au-hero {
        position: relative; min-height: 480px;
        background-image: url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400&auto=format&fit=crop&q=80');
        background-size: cover; background-position: center;
        display: flex; align-items: center; justify-content: center; text-align: center;
        overflow: hidden;
      }
      .au-hero::after { content:''; position:absolute; inset:0; background:linear-gradient(160deg,rgba(50,10,10,.6) 0%,rgba(80,20,20,.4) 100%); }
      .au-hero-content { position:relative; z-index:2; color:#fff; padding:40px 28px; }
      .au-hero-eyebrow { font-size:.72rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.8); margin-bottom:16px; }
      .au-hero h1 { font-family:'Playfair Display',serif; font-size:clamp(2.4rem,6vw,4rem); font-weight:700; margin:0 0 16px; color:#fff; line-height:1.1; }
      .au-hero h1 em { font-style:italic; color:#f9c8c8; }
      .au-hero-sub { font-size:1.05rem; opacity:.9; max-width:560px; margin:0 auto 32px; font-weight:500; line-height:1.65; }
      .au-hero-cta { display:inline-block; padding:13px 36px; background:linear-gradient(135deg,#e8857a,#c96b60); color:#fff; border-radius:30px; font-weight:700; text-decoration:none; font-size:.96rem; transition:transform .2s,box-shadow .2s; }
      .au-hero-cta:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(232,133,122,.45); color:#fff; }

      /* Stats strip */
      .au-stats { background:#fff8f7; border-top:1px solid #f0d5d0; border-bottom:1px solid #f0d5d0; padding:36px 40px; display:flex; justify-content:center; gap:60px; flex-wrap:wrap; }
      .au-stat { text-align:center; }
      .au-stat-num { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:700; color:#e8857a; line-height:1; }
      .au-stat-label { font-size:.8rem; font-weight:700; color:#7a3a3a; margin-top:4px; letter-spacing:.04em; }

      /* Sections */
      .au-section { max-width:1100px; margin:0 auto; padding:80px 40px; }
      .au-section-2col { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
      .au-section-2col.rev { direction:rtl; }
      .au-section-2col.rev > * { direction:ltr; }
      .au-section-img { border-radius:22px; overflow:hidden; box-shadow:0 12px 48px rgba(180,60,60,.14); }
      .au-section-img img { width:100%; height:380px; object-fit:cover; display:block; }
      .au-eyebrow { font-size:.7rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#e8857a; margin-bottom:12px; }
      .au-h2 { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,3.5vw,2.6rem); color:#3d1818; margin:0 0 16px; font-weight:700; line-height:1.15; }
      .au-h2 em { font-style:italic; color:#e8857a; }
      .au-text { font-size:.97rem; color:#6a3030; line-height:1.8; font-weight:500; margin-bottom:14px; }

      /* Values */
      .au-values-bg { background:#fff8f7; padding:80px 40px; }
      .au-values-inner { max-width:1100px; margin:0 auto; }
      .au-values-title { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,3.5vw,2.4rem); color:#3d1818; text-align:center; margin:0 0 10px; }
      .au-values-sub { font-size:.95rem; color:#8c5050; text-align:center; margin:0 0 48px; font-weight:500; }
      .au-values-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
      .au-value-card { background:#fff; border-radius:18px; border:1px solid #f0d5d0; padding:28px; text-align:center; transition:transform .2s,box-shadow .2s; }
      .au-value-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(180,60,60,.1); }
      .au-value-icon { font-size:2.2rem; margin-bottom:14px; }
      .au-value-title { font-family:'Playfair Display',serif; font-size:1.1rem; color:#3d1818; margin:0 0 8px; font-weight:700; }
      .au-value-text { font-size:.86rem; color:#7a3a3a; line-height:1.7; font-weight:500; }

      /* Team */
      .au-team-bg { background:#fff; padding:80px 40px; }
      .au-team-inner { max-width:1100px; margin:0 auto; }
      .au-team-title { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,3.5vw,2.4rem); color:#3d1818; text-align:center; margin:0 0 10px; }
      .au-team-sub { font-size:.95rem; color:#8c5050; text-align:center; margin:0 0 48px; font-weight:500; }
      .au-team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
      .au-team-card { text-align:center; }
      .au-team-img { width:120px; height:120px; border-radius:50%; object-fit:cover; margin:0 auto 16px; border:4px solid #fde8e8; display:block; background:linear-gradient(135deg,#fde8e8,#fff4f4); font-size:3rem; display:flex; align-items:center; justify-content:center; }
      .au-team-name { font-family:'Playfair Display',serif; font-size:1.1rem; color:#3d1818; margin:0 0 4px; font-weight:700; }
      .au-team-role { font-size:.82rem; font-weight:700; color:#e8857a; text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; }
      .au-team-bio { font-size:.84rem; color:#7a3a3a; line-height:1.6; }

      /* CTA banner */
      .au-cta { background:linear-gradient(135deg,#e8857a 0%,#c96b60 100%); padding:80px 40px; text-align:center; }
      .au-cta h2 { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,4vw,2.6rem); color:#fff; margin:0 0 12px; font-weight:700; }
      .au-cta p { color:rgba(255,255,255,.88); font-size:1.02rem; margin:0 0 36px; font-weight:500; }
      .au-cta-row { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
      .au-cta-btn { display:inline-block; padding:13px 40px; background:#fff; color:#c96b60; border-radius:30px; font-weight:700; text-decoration:none; font-size:.96rem; transition:transform .2s,box-shadow .2s; }
      .au-cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.14); color:#c96b60; }
      .au-cta-btn-outline { display:inline-block; padding:12px 36px; border:2px solid rgba(255,255,255,.7); color:#fff; border-radius:30px; font-weight:700; text-decoration:none; font-size:.96rem; transition:all .2s; }
      .au-cta-btn-outline:hover { background:rgba(255,255,255,.15); border-color:#fff; color:#fff; }

      @media(max-width:900px){
        .au-section-2col { grid-template-columns:1fr; gap:32px; }
        .au-section-2col.rev { direction:ltr; }
        .au-values-grid { grid-template-columns:1fr; }
        .au-team-grid { grid-template-columns:1fr 1fr; }
        .au-stats { gap:36px; padding:28px 24px; }
        .au-section { padding:52px 22px; }
        .au-hero-content { padding:52px 22px; }
      }
      @media(max-width:560px){ .au-team-grid { grid-template-columns:1fr; } }
    `}</style>

    <div className="au-page">
      {/* Hero */}
      <section className="au-hero">
        <div className="au-hero-content">
          <p className="au-hero-eyebrow">Est. 2018 · Pandura, Sri Lanka</p>
          <h1>Baked with <em>Love</em>,<br/>Every Single Day</h1>
          <p className="au-hero-sub">Chara Cakes started as a dream in a home kitchen and grew into Sri Lanka's most loved artisan cake boutique — one celebration at a time.</p>
          <Link to="/cakes" className="au-hero-cta">Explore Our Cakes</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="au-stats">
        {[
          { num:'5,000+', label:'Happy Customers' },
          { num:'12,000+', label:'Cakes Delivered' },
          { num:'6+',     label:'Years of Baking' },
          { num:'200+',   label:'Unique Designs' },
        ].map(s => (
          <div key={s.label} className="au-stat">
            <div className="au-stat-num">{s.num}</div>
            <div className="au-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <section className="au-section">
        <div className="au-section-2col">
          <div className="au-section-img">
            <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80" alt="Our bakery kitchen" />
          </div>
          <div>
            <p className="au-eyebrow">Our Story</p>
            <h2 className="au-h2">From a Home Kitchen to <em>Your Heart</em></h2>
            <p className="au-text">Chara Cakes was born in 2018 when Founder N. began baking celebration cakes for friends and family from her home in Pandura. Word spread quickly — not just about how beautiful the cakes looked, but how extraordinary they tasted.</p>
            <p className="au-text">By 2020 Chara Cakes had its first dedicated kitchen and a small team of passionate bakers. Today we serve customers island-wide, crafting everything from elegant wedding tiers to fun, colourful birthday cakes — all made to order with the finest ingredients.</p>
            <p className="au-text">Every cake that leaves our kitchen is baked fresh, never frozen, and decorated with genuine care for the person celebrating.</p>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="au-section" style={{paddingTop:0}}>
        <div className="au-section-2col rev">
          <div className="au-section-img">
            <img src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop&q=80" alt="Fresh ingredients" />
          </div>
          <div>
            <p className="au-eyebrow">Our Promise</p>
            <h2 className="au-h2">Quality You Can <em>Taste</em></h2>
            <p className="au-text">We source only fresh, locally grown ingredients where possible. No artificial preservatives, no frozen layers — just honest, real baking.</p>
            <p className="au-text">Every order is reviewed personally before it leaves our kitchen. If it doesn't meet our standards, we bake it again. It's that simple.</p>
            <p className="au-text">We also believe cakes should be inclusive — we offer eggless, gluten-free, vegan and sugar-free options so everyone can enjoy a Chara Cake.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <div className="au-values-bg">
        <div className="au-values-inner">
          <h2 className="au-values-title">What We Stand For</h2>
          <p className="au-values-sub">The values that guide everything we bake and every customer we serve.</p>
          <div className="au-values-grid">
            {[
              { icon:'🎂', title:'Freshness First',   text:'Every cake is baked to order and delivered fresh. We never store finished cakes in a freezer.' },
              { icon:'💌', title:'Made with Care',    text:'Our bakers take pride in every layer, every decoration. Your celebration matters to us personally.' },
              { icon:'✨', title:'Quality Ingredients',text:'We use premium butter, fresh eggs, real cream and natural flavourings — nothing artificial.' },
              { icon:'🎨', title:'Unique Designs',    text:'No two cakes are exactly alike. We work with you to create something truly one of a kind.' },
              { icon:'🚚', title:'Reliable Delivery', text:'We deliver island-wide on the date you choose. Your cake arrives on time, in perfect condition.' },
              { icon:'🌱', title:'Inclusive Baking',  text:'Eggless, vegan, gluten-free options available. Everyone deserves a delicious celebration cake.' },
            ].map(v => (
              <div key={v.title} className="au-value-card">
                <div className="au-value-icon">{v.icon}</div>
                <h3 className="au-value-title">{v.title}</h3>
                <p className="au-value-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="au-team-bg">
        <div className="au-team-inner">
          <h2 className="au-team-title">Meet the Team</h2>
          <p className="au-team-sub">The people behind every beautiful cake.</p>
          <div className="au-team-grid">
            {[
              { emoji:'👩‍🍳', name:'C. Perera', role:'Founder & Head Baker',    bio:'With 10+ years of pastry experience, C. leads the kitchen with creativity and precision.' },
              { emoji:'🎨', name:'N. Silva',    role:'Cake Artist & Designer',  bio:'N. turns cake surfaces into edible art — from sugar flowers to hand-painted designs.' },
              { emoji:'🚚', name:'R. Fernando',  role:'Delivery & Operations',   bio:'R. ensures every cake arrives safely and on time, no matter where in Sri Lanka you are.' },
            ].map(m => (
              <div key={m.name} className="au-team-card">
                <div className="au-team-img" style={{margin:'0 auto 16px',borderRadius:'50%',width:120,height:120,background:'linear-gradient(135deg,#fde8e8,#fff4f4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',border:'4px solid #fde8e8'}}>
                  {m.emoji}
                </div>
                <h3 className="au-team-name">{m.name}</h3>
                <div className="au-team-role">{m.role}</div>
                <p className="au-team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="au-cta">
        <h2>Ready to Order Your Dream Cake?</h2>
        <p>Browse our collection or design something completely unique — we'd love to be part of your celebration.</p>
        <div className="au-cta-row">
          <Link to="/cakes"      className="au-cta-btn">Shop Cakes</Link>
          <Link to="/customizes" className="au-cta-btn-outline">Customize Yours</Link>
        </div>
      </div>

      <Footer />
    </div>
  </>
);

export default AboutUs;

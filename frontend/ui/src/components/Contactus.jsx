import React, { useState } from 'react';
import Footer from './Footer';

const ContactUs = () => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send (replace with real API call)
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
    setForm({ name:'', email:'', phone:'', subject:'', message:'' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        .cu-page { font-family: 'Quicksand', sans-serif; background: #fff; }

        /* Hero */
        .cu-hero {
          background: linear-gradient(120deg, #e8857a 0%, #c96b60 100%);
          padding: 72px 40px 64px; text-align: center; color: #fff;
        }
        .cu-hero-eyebrow { font-size: .72rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.8); margin-bottom: 14px; }
        .cu-hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem,5vw,3.4rem); font-weight: 700; margin: 0 0 14px; color: #fff; }
        .cu-hero p { font-size: 1.05rem; opacity: .88; max-width: 520px; margin: 0 auto; font-weight: 500; }

        /* Body */
        .cu-body { max-width: 1180px; margin: 0 auto; padding: 72px 40px 80px; display: grid; grid-template-columns: 1fr 420px; gap: 60px; align-items: start; }

        /* Info side */
        .cu-info-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; color: #3d1818; margin: 0 0 10px; font-weight: 700; }
        .cu-info-sub { font-size: .95rem; color: #8c5050; font-weight: 500; margin-bottom: 36px; line-height: 1.6; }

        .cu-contact-cards { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
        .cu-contact-card {
          display: flex; align-items: flex-start; gap: 16px;
          background: #fff8f7; border: 1px solid #f0d5d0;
          border-radius: 16px; padding: 18px 22px;
          transition: box-shadow .2s;
        }
        .cu-contact-card:hover { box-shadow: 0 6px 22px rgba(180,60,60,.09); }
        .cu-contact-icon { width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(135deg,#e8857a,#c96b60); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
        .cu-contact-label { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #a07070; margin-bottom: 3px; }
        .cu-contact-value { font-size: .95rem; font-weight: 700; color: #3d1818; }
        .cu-contact-value a { color: #e8857a; text-decoration: none; }
        .cu-contact-value a:hover { color: #c96b60; }

        /* Map placeholder */
        .cu-map {
          border-radius: 18px; overflow: hidden;
          border: 1px solid #f0d5d0;
          background: linear-gradient(135deg, #fde8e8 0%, #fff4f4 100%);
          height: 200px; display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 8px; color: #c96b60;
        }
        .cu-map-icon { font-size: 2.5rem; }
        .cu-map-text { font-size: .84rem; font-weight: 600; color: #a07070; }

        /* Hours */
        .cu-hours { margin-top: 28px; }
        .cu-hours-title { font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #e8857a; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1.5px solid #f0d5d0; }
        .cu-hours-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fde8e8; font-size: .88rem; }
        .cu-hours-day { color: #7a3a3a; font-weight: 600; }
        .cu-hours-time { color: #4a2020; font-weight: 500; }
        .cu-hours-closed { color: #b08080; font-style: italic; }

        /* Form side */
        .cu-form-card { background: #fff; border-radius: 20px; border: 1px solid #f0d5d0; padding: 36px 40px; box-shadow: 0 4px 30px rgba(180,60,60,.07); }
        .cu-form-title { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #3d1818; margin: 0 0 24px; font-weight: 700; }

        .cu-fg { display: flex; flex-direction: column; margin-bottom: 18px; }
        .cu-label { font-size: .7rem; font-weight: 700; color: #7a3a3a; margin-bottom: 7px; letter-spacing: .09em; text-transform: uppercase; }
        .cu-label span { color: #e8857a; margin-left: 2px; }
        .cu-input {
          border: 1.5px solid #f0d5d0; border-radius: 10px; padding: 11px 14px;
          font-family: 'Quicksand', sans-serif; font-size: .94rem; color: #4a2020;
          background: #fff; transition: border-color .2s, box-shadow .2s; outline: none; width: 100%;
        }
        .cu-input:focus { border-color: #e8857a; box-shadow: 0 0 0 3px rgba(232,133,122,.13); }
        .cu-textarea { min-height: 130px; resize: vertical; }
        .cu-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .cu-submit {
          background: linear-gradient(135deg, #e8857a, #c96b60); color: #fff; border: none;
          padding: 13px 36px; border-radius: 30px; font-family: 'Quicksand', sans-serif;
          font-weight: 700; font-size: .95rem; cursor: pointer; width: 100%;
          letter-spacing: .04em; transition: transform .2s, box-shadow .2s; margin-top: 4px;
        }
        .cu-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,133,122,.36); }
        .cu-submit:disabled { opacity: .7; cursor: not-allowed; }

        .cu-success {
          text-align: center; padding: 40px 20px;
        }
        .cu-success-icon { font-size: 3rem; margin-bottom: 14px; }
        .cu-success-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #3d1818; margin-bottom: 8px; }
        .cu-success-sub { color: #8c5050; font-size: .92rem; font-weight: 500; }

        @media (max-width: 900px) {
          .cu-body { grid-template-columns: 1fr; gap: 40px; padding: 48px 22px 64px; }
          .cu-hero { padding: 52px 22px 44px; }
          .cu-form-row { grid-template-columns: 1fr; }
          .cu-form-card { padding: 28px 22px; }
        }
      `}</style>

      <div className="cu-page">
        {/* Hero */}
        <div className="cu-hero">
          <p className="cu-hero-eyebrow">We'd love to hear from you</p>
          <h1>Contact Us</h1>
          <p>Have a question about an order, a custom cake, or just want to say hello? We're here for you.</p>
        </div>

        <div className="cu-body">
          {/* Info column */}
          <div>
            <h2 className="cu-info-title">Get in Touch</h2>
            <p className="cu-info-sub">Visit our bakery, call us, or drop us a message — we'll get back to you within one business day.</p>

            <div className="cu-contact-cards">
              <div className="cu-contact-card">
                <div className="cu-contact-icon">📍</div>
                <div>
                  <div className="cu-contact-label">Address</div>
                  <div className="cu-contact-value">24/A, Vajira Road, Pandura, Sri Lanka</div>
                </div>
              </div>
              <div className="cu-contact-card">
                <div className="cu-contact-icon">📞</div>
                <div>
                  <div className="cu-contact-label">Phone</div>
                  <div className="cu-contact-value"><a href="tel:+94123456789">+94 12 345 6789</a></div>
                </div>
              </div>
              <div className="cu-contact-card">
                <div className="cu-contact-icon">✉️</div>
                <div>
                  <div className="cu-contact-label">Email</div>
                  <div className="cu-contact-value"><a href="mailto:info@characakes.com">info@characakes.com</a></div>
                </div>
              </div>
              <div className="cu-contact-card">
                <div className="cu-contact-icon">📸</div>
                <div>
                  <div className="cu-contact-label">Instagram</div>
                  <div className="cu-contact-value"><a href="https://instagram.com" target="_blank" rel="noreferrer">@characakes</a></div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="cu-map">
              <div className="cu-map-icon">🗺️</div>
              <div className="cu-map-text">24/A Vajira Road, Pandura, Sri Lanka</div>
            </div>

            {/* Hours */}
            <div className="cu-hours">
              <p className="cu-hours-title">Opening Hours</p>
              {[
                { day:'Monday – Friday', time:'8:00 AM – 6:00 PM' },
                { day:'Saturday',        time:'9:00 AM – 5:00 PM' },
                { day:'Sunday',          time:'10:00 AM – 3:00 PM' },
                { day:'Public Holidays', time:null },
              ].map(r => (
                <div key={r.day} className="cu-hours-row">
                  <span className="cu-hours-day">{r.day}</span>
                  {r.time ? <span className="cu-hours-time">{r.time}</span> : <span className="cu-hours-closed">Closed</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className="cu-form-card">
            {sent ? (
              <div className="cu-success">
                <div className="cu-success-icon">🎂</div>
                <div className="cu-success-title">Message Sent!</div>
                <p className="cu-success-sub">Thank you for reaching out. We'll get back to you within one business day.</p>
                <button style={{marginTop:20,background:'none',border:'1.5px solid #e8857a',color:'#e8857a',padding:'10px 28px',borderRadius:30,fontFamily:'Quicksand,sans-serif',fontWeight:700,cursor:'pointer',fontSize:'.9rem'}} onClick={()=>setSent(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="cu-form-title">Send us a message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="cu-form-row">
                    <div className="cu-fg"><label className="cu-label">Name <span>*</span></label><input className="cu-input" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required/></div>
                    <div className="cu-fg"><label className="cu-label">Email <span>*</span></label><input className="cu-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required/></div>
                  </div>
                  <div className="cu-form-row">
                    <div className="cu-fg"><label className="cu-label">Phone</label><input className="cu-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 123 4567"/></div>
                    <div className="cu-fg"><label className="cu-label">Subject <span>*</span></label>
                      <select className="cu-input" name="subject" value={form.subject} onChange={handleChange} required>
                        <option value="">Select a topic</option>
                        <option>Order enquiry</option>
                        <option>Custom cake request</option>
                        <option>Delivery question</option>
                        <option>Feedback</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="cu-fg"><label className="cu-label">Message <span>*</span></label><textarea className="cu-input cu-textarea" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help…" required/></div>
                  <button type="submit" className="cu-submit" disabled={sending}>{sending?'Sending…':'Send Message'}</button>
                </form>
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;

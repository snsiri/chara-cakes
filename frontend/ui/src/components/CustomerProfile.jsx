import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CustomerSidebar from './CustomerSidebar';
import './CustomerProfile.css';

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
const Stars = ({ n=0 }) => <span style={{color:'#f5a623',letterSpacing:1}}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>;

/* CSS constant removed — styles live in CustomerProfile.css */
const _UNUSED = `
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
.pf-page{width:100%;min-height:calc(100vh - 70px);background:#fff8f7;font-family:'Quicksand',sans-serif;}
.pf-hero{background:linear-gradient(115deg,#e8857a 0%,#c96b60 100%);padding:44px 60px 36px;color:#fff;}
.pf-hero h1{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:.04em;margin:0 0 6px;text-transform:uppercase;font-weight:700;color:#fff;}
.pf-hero-sub{font-size:.9rem;opacity:.88;font-weight:500;color:#fff;}
.pf-body{display:grid;grid-template-columns:260px 1fr;max-width:1180px;margin:0 auto;padding:48px 28px 64px;gap:40px;align-items:start;}
.pf-card{background:#fff;border-radius:18px;padding:40px 48px;box-shadow:0 4px 30px rgba(180,60,60,.07);border:1px solid #f0d5d0;}
.pf-card-title{font-family:'Playfair Display',serif;color:#4a2020;font-size:1.5rem;margin:0 0 28px;text-align:center;font-weight:700;}
.pf-form-row{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px;}
.pf-fg{display:flex;flex-direction:column;margin-bottom:18px;}
.pf-label{font-size:.7rem;font-weight:700;color:#7a3a3a;margin-bottom:7px;letter-spacing:.09em;text-transform:uppercase;}
.pf-label span{color:#e8857a;}
.pf-input{border:1.5px solid #f0d5d0;border-radius:10px;padding:11px 14px;font-family:'Quicksand',sans-serif;font-size:.94rem;color:#4a2020;background:#fff;transition:border-color .2s,box-shadow .2s;outline:none;width:100%;}
.pf-input:focus{border-color:#e8857a;box-shadow:0 0 0 3px rgba(232,133,122,.13);}
.pf-hint{font-size:.76rem;color:#a07070;font-style:italic;margin-top:4px;line-height:1.4;}
.pf-sep{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7a3a3a;border-top:1.5px solid #f0d5d0;padding-top:20px;margin:24px 0 20px;}
.pf-btn{background:linear-gradient(135deg,#e8857a,#c96b60);color:#fff;border:none;padding:12px 36px;border-radius:50px;font-family:'Quicksand',sans-serif;font-weight:700;font-size:.92rem;cursor:pointer;letter-spacing:.04em;transition:transform .2s,box-shadow .2s;}
.pf-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(232,133,122,.36);}
.pf-btn-sm{background:none;border:1.5px solid #f0d5d0;color:#7a3a3a;padding:6px 14px;border-radius:20px;font-family:'Quicksand',sans-serif;font-weight:700;font-size:.78rem;cursor:pointer;transition:all .18s;}
.pf-btn-sm:hover{border-color:#e8857a;color:#e8857a;}
.pf-btn-danger{background:none;border:1.5px solid #fecaca;color:#c0392b;padding:6px 14px;border-radius:20px;font-family:'Quicksand',sans-serif;font-weight:700;font-size:.78rem;cursor:pointer;transition:all .18s;}
.pf-btn-danger:hover{background:#fef2f2;}
.pf-ok{background:#fff0ee;border:1px solid #e8857a;color:#8b2020;padding:12px 18px;border-radius:10px;font-size:.87rem;font-weight:600;margin-bottom:20px;}
.pf-err{background:#fff5f5;border:1px solid #f5c2c7;color:#842029;padding:12px 18px;border-radius:10px;font-size:.87rem;margin-bottom:20px;}
.pf-filter-row{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
.pf-filter-btn{padding:7px 18px;border-radius:20px;border:1.5px solid #f0d5d0;background:#fff;font-family:'Quicksand',sans-serif;font-size:.82rem;font-weight:700;color:#7a3a3a;cursor:pointer;transition:all .18s;}
.pf-filter-btn:hover{border-color:#e8857a;color:#e8857a;}
.pf-filter-btn.act{background:#e8857a;border-color:#e8857a;color:#fff;}
.pf-table{width:100%;border-collapse:collapse;font-size:.86rem;font-family:'Quicksand',sans-serif;}
.pf-table th{text-align:left;padding:10px 14px;background:#fff3f1;color:#7a3a3a;font-weight:700;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;border-bottom:2px solid #f0d5d0;}
.pf-table td{padding:12px 14px;border-bottom:1px solid #fde8e8;color:#4a2020;vertical-align:middle;}
.pf-table tr.click{cursor:pointer;}
.pf-table tr.click:hover td{background:#fff3f1;}
.pf-badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:.72rem;font-weight:700;}
.pf-badge-p{background:#fff3cd;color:#856404;}
.pf-badge-d{background:#d1e7dd;color:#0f5132;}
.pf-badge-c{background:#fde8e8;color:#c85050;}
.pf-sub-lbl{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8857a;margin:20px 0 12px;padding-bottom:8px;border-bottom:1.5px solid #f0d5d0;}
.pf-cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;}
.pf-cc{background:#fff8f7;border:1.5px solid #f0d5d0;border-radius:14px;padding:18px;cursor:pointer;transition:box-shadow .2s,border-color .2s;}
.pf-cc:hover{box-shadow:0 6px 22px rgba(180,60,60,.1);border-color:#e8857a;}
.pf-cc-title{font-weight:700;color:#4a2020;font-size:.93rem;margin-bottom:4px;}
.pf-cc-price{font-weight:700;color:#e8857a;font-size:1rem;margin-top:6px;}
.pf-rl{display:flex;flex-direction:column;gap:12px;}
.pf-rc{background:#fff8f7;border:1px solid #f0d5d0;border-radius:14px;padding:18px;}
.pf-rc-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;}
.pf-rc-prod{font-weight:700;color:#4a2020;font-size:.92rem;}
.pf-rc-date{font-size:.76rem;color:#a07070;}
.pf-rc-txt{font-size:.9rem;color:#5a2a2a;line-height:1.6;margin:0;font-style:italic;}
.pf-al{display:flex;flex-direction:column;gap:12px;margin-bottom:20px;}
.pf-ac{background:#fff8f7;border:1.5px solid #f0d5d0;border-radius:14px;padding:18px 20px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
.pf-ac.def{border-color:#e8857a;background:#fff3f1;}
.pf-ac-info{flex:1;}
.pf-ac-name{font-weight:700;color:#4a2020;font-size:.93rem;margin-bottom:3px;}
.pf-ac-line{font-size:.84rem;color:#7a3a3a;line-height:1.7;}
.pf-ac-def-badge{display:inline-block;background:#e8857a;color:#fff;font-size:.66rem;font-weight:700;padding:2px 10px;border-radius:20px;letter-spacing:.06em;margin-top:4px;}
.pf-ac-actions{display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;}
.pf-add-btn{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px dashed #e8857a;border-radius:14px;padding:14px 20px;width:100%;font-family:'Quicksand',sans-serif;font-size:.9rem;font-weight:700;color:#e8857a;cursor:pointer;transition:background .2s;}
.pf-add-btn:hover{background:#fff3f1;}
.pf-empty{text-align:center;padding:52px 20px;color:#a07070;font-family:'Quicksand',sans-serif;}
.pf-empty strong{display:block;font-size:1rem;color:#7a3a3a;margin-bottom:8px;}
.pf-link{display:inline-block;margin-top:16px;background:linear-gradient(135deg,#e8857a,#c96b60);color:#fff;padding:10px 28px;border-radius:24px;font-weight:700;text-decoration:none;font-size:.87rem;}
.pf-link:hover{color:#fff;}
.pf-loading{text-align:center;padding:48px;color:#a07070;font-weight:600;}
.pf-chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;}
.pf-chip{border-radius:10px;padding:8px 16px;font-size:.8rem;font-weight:700;}
.pf-hint-row{font-size:.76rem;color:#a07070;font-style:italic;margin-top:10px;}
/* Modal */
.pf-ov{position:fixed;inset:0;background:rgba(40,10,10,.48);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
.pf-mo{background:#fff;border-radius:20px;max-width:640px;width:100%;max-height:90vh;overflow-y:auto;padding:36px 40px;position:relative;box-shadow:0 20px 60px rgba(180,60,60,.2);}
.pf-mo-x{position:absolute;top:16px;right:18px;background:#fff3f1;border:none;border-radius:50%;width:32px;height:32px;font-size:1rem;color:#c96b60;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.pf-mo-x:hover{background:#fde0e0;}
.pf-mo-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:#4a2020;margin:0 0 20px;font-weight:700;}
.pf-dr{display:flex;gap:8px;margin-bottom:10px;font-size:.87rem;}
.pf-dl{font-weight:700;color:#7a3a3a;min-width:120px;flex-shrink:0;}
.pf-dv{color:#4a2020;}
.pf-ms{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#e8857a;border-top:1.5px solid #f0d5d0;padding-top:14px;margin:18px 0 10px;}
.pf-oi{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #fde8e8;}
.pf-oi-img{width:54px;height:54px;border-radius:10px;object-fit:cover;border:1px solid #f0d5d0;flex-shrink:0;}
.pf-oi-name{font-weight:700;color:#4a2020;font-size:.88rem;}
.pf-oi-sub{font-size:.78rem;color:#7a3a3a;}
@media(max-width:820px){
  .pf-body{grid-template-columns:1fr;padding:22px 16px 48px;}
  .pf-hero{padding:30px 22px 24px;}
  .pf-card{padding:26px 20px;}
  .pf-form-row{grid-template-columns:1fr;}
  .pf-cg{grid-template-columns:1fr;}
  .pf-mo{padding:26px 20px;}
}`;

/* ══════════════════════════════════════════════════════ */
const CustomerProfile = ({ customer, setCustomer }) => {
  const [activeTab,      setActiveTab]      = useState('account');
  const [orders,         setOrders]         = useState([]);
  const [customizes,     setCustomizes]     = useState([]);
  const [cartCustoms,    setCartCustoms]    = useState([]);
  const [reviews,        setReviews]        = useState([]);
  const [addresses,      setAddresses]      = useState([]);
  const [orderFilter,    setOrderFilter]    = useState('all');
  const [selOrder,       setSelOrder]       = useState(null);
  const [selCustom,      setSelCustom]      = useState(null);
  const [addrModal,      setAddrModal]      = useState(false);
  const [editAddrId,     setEditAddrId]     = useState(null);
  const [addrForm,       setAddrForm]       = useState({ label:'Home', name:'', phone:'', address:'', city:'', postalCode:'' });
  const [formData,       setFormData]       = useState({ firstName:'', lastName:'', displayName:'', email:'', currentPassword:'', newPassword:'', confirmNewPassword:'' });
  const [success,        setSuccess]        = useState('');
  const [error,          setError]          = useState('');
  const [loading,        setLoading]        = useState(false);

  /* populate form */
  useEffect(() => {
    if (!customer) return;
    const p = (customer.name||'').split(' ');
    setFormData(x => ({ ...x, firstName:p[0]||'', lastName:p.slice(1).join(' ')||'', displayName:customer.name||'', email:customer.email||'' }));
    const saved = localStorage.getItem(`cc_addrs_${customer._id}`);
    if (saved) setAddresses(JSON.parse(saved));
  }, [customer]);

  const persistAddrs = (list) => {
    setAddresses(list);
    localStorage.setItem(`cc_addrs_${customer?._id}`, JSON.stringify(list));
  };

  /* fetch on tab */
  useEffect(() => {
    if (activeTab==='orders')     fetchOrders();
    if (activeTab==='customizes') fetchCustomizes();
    if (activeTab==='reviews')    fetchReviews();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try { const r = await api.get('/api/orders/my-orders'); setOrders(Array.isArray(r.data)?r.data:[]); }
    catch { setOrders([]); } finally { setLoading(false); }
  };

  const fetchCustomizes = async () => {
    setLoading(true);
    try {
      const [oR, cR] = await Promise.all([api.get('/api/orders/my-orders'), api.get('/api/cart')]);
      const all = Array.isArray(oR.data)?oR.data:[];
      setCustomizes(all.flatMap(o=>(o.customize||[]).map(c=>({...c,source:'order',orderId:o._id,isDelivered:o.isDelivered,orderedAt:o.createdAt}))));
      if (cR.data.status==='Success') setCartCustoms(cR.data.data.customize||[]);
    } catch { setCustomizes([]); setCartCustoms([]); } finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try { const r = await api.get('/api/feedback/my-feedbacks'); setReviews(Array.isArray(r.data?.data)?r.data.data:[]); }
    catch { setReviews([]); } finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');

    // Validate password change fields if any are filled
    const wantsPasswordChange = formData.currentPassword || formData.newPassword || formData.confirmNewPassword;
    if (wantsPasswordChange) {
      if (!formData.currentPassword) { setError('Please enter your current password.'); return; }
      if (!formData.newPassword)     { setError('Please enter a new password.'); return; }
      if (formData.newPassword !== formData.confirmNewPassword) { setError('New passwords do not match.'); return; }
      if (formData.newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
    }

    try {
      // 1. Update profile (name + email)
      await api.put('/api/auth/customer/update', {
        name:  `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      });

      // 2. Update password only if the user filled in those fields
      if (wantsPasswordChange) {
        await api.put('/api/auth/customer/update-password', {
          currentPassword:    formData.currentPassword,
          newPassword:        formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        });
      }

      setSuccess('Account details saved successfully!');
      setFormData(p => ({ ...p, currentPassword:'', newPassword:'', confirmNewPassword:'' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update. Please try again.');
    }
  };

  /* address CRUD */
  const openAdd  = () => { setEditAddrId(null); setAddrForm({label:'Home',name:'',phone:'',address:'',city:'',postalCode:''}); setAddrModal(true); };
  const openEdit = (a) => { setEditAddrId(a.id); setAddrForm({...a}); setAddrModal(true); };
  const delAddr  = (id) => { if(window.confirm('Delete this address?')) persistAddrs(addresses.filter(a=>a.id!==id)); };
  const setDef   = (id) => persistAddrs(addresses.map(a=>({...a,isDefault:a.id===id})));
  const saveAddr = () => {
    if (!addrForm.name||!addrForm.address||!addrForm.city) { alert('Please fill in Name, Street Address and City.'); return; }
    if (editAddrId) {
      persistAddrs(addresses.map(a=>a.id===editAddrId?{...addrForm,id:editAddrId}:a));
    } else {
      persistAddrs([...addresses, {...addrForm, id:Date.now().toString(), isDefault:addresses.length===0}]);
    }
    setAddrModal(false);
  };

  const filtered = orders.filter(o => orderFilter==='all'?true:orderFilter==='processing'?!o.isDelivered:o.isDelivered);

  return (
    <>

      {/* ── Order modal ── */}
      {selOrder && (
        <div className="pf-ov" onClick={()=>setSelOrder(null)}>
          <div className="pf-mo" onClick={e=>e.stopPropagation()}>
            <button className="pf-mo-x" onClick={()=>setSelOrder(null)}>✕</button>
            <h3 className="pf-mo-title">Order Details</h3>
            <div className="pf-dr"><span className="pf-dl">Order ID</span><span className="pf-dv" style={{fontSize:'.76rem'}}>#{selOrder._id}</span></div>
            <div className="pf-dr"><span className="pf-dl">Date placed</span><span className="pf-dv">{fmt(selOrder.createdAt)}</span></div>
            <div className="pf-dr"><span className="pf-dl">Delivery date</span><span className="pf-dv">{fmt(selOrder.deliveryDate)}</span></div>
            <div className="pf-dr"><span className="pf-dl">Status</span><span className={`pf-badge ${selOrder.isDelivered?'pf-badge-d':'pf-badge-p'}`}>{selOrder.isDelivered?'Delivered':'In Progress'}</span></div>
            <div className="pf-dr"><span className="pf-dl">Payment</span><span className="pf-dv">{selOrder.paymentMethod||'—'}</span></div>
            {selOrder.deliveryAddress && (<><p className="pf-ms">Delivery Address</p><div style={{fontSize:'.87rem',lineHeight:1.7,color:'#4a2020'}}>{selOrder.deliveryAddress.address}<br/>{selOrder.deliveryAddress.city}{selOrder.deliveryAddress.postalCode?`, ${selOrder.deliveryAddress.postalCode}`:''}</div></>)}
            {selOrder.product?.length>0 && (<><p className="pf-ms">Products</p>{selOrder.product.map((it,i)=>(<div key={i} className="pf-oi">{it.product_image&&<img src={it.product_image} alt={it.product_name} className="pf-oi-img"/>}<div style={{flex:1}}><div className="pf-oi-name">{it.product_name}</div><div className="pf-oi-sub">Qty: {it.quantity} · Rs. {Number(it.product_price).toFixed(2)} each</div></div><div style={{fontWeight:700,color:'#e8857a'}}>Rs. {(Number(it.product_price)*it.quantity).toFixed(2)}</div></div>))}</>)}
            {selOrder.customize?.length>0 && (<><p className="pf-ms">Custom Cakes</p>{selOrder.customize.map((it,i)=>(<div key={i} className="pf-oi"><div style={{width:54,height:54,borderRadius:10,background:'#fde8e8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>🎂</div><div style={{flex:1}}><div className="pf-oi-name">Custom Cake</div><div className="pf-oi-sub">Qty: {it.quantity}</div></div><div style={{fontWeight:700,color:'#e8857a'}}>Rs. {Number(it.custom_price).toFixed(2)}</div></div>))}</>)}
            <p className="pf-ms">Price Summary</p>
            <div className="pf-dr"><span className="pf-dl">Items</span><span className="pf-dv">Rs. {selOrder.itemsPrice?.toFixed(2)||'0.00'}</span></div>
            <div className="pf-dr"><span className="pf-dl">Delivery</span><span className="pf-dv">Rs. {selOrder.deliveryfee?.toFixed(2)||'0.00'}</span></div>
            <div className="pf-dr" style={{fontWeight:700,marginTop:4}}><span className="pf-dl">Total</span><span className="pf-dv" style={{color:'#e8857a',fontSize:'1.05rem'}}>Rs. {selOrder.totalPrice?.toFixed(2)}</span></div>
          </div>
        </div>
      )}

      {/* ── Custom cake modal ── */}
      {selCustom && (
        <div className="pf-ov" onClick={()=>setSelCustom(null)}>
          <div className="pf-mo" onClick={e=>e.stopPropagation()}>
            <button className="pf-mo-x" onClick={()=>setSelCustom(null)}>✕</button>
            <h3 className="pf-mo-title">Custom Cake Details</h3>
            <div className="pf-dr"><span className="pf-dl">Price</span><span className="pf-dv" style={{color:'#e8857a',fontWeight:700}}>Rs. {Number(selCustom.custom_price).toFixed(2)}</span></div>
            <div className="pf-dr"><span className="pf-dl">Quantity</span><span className="pf-dv">{selCustom.quantity}</span></div>
            <div className="pf-dr"><span className="pf-dl">Status</span><span className={`pf-badge ${selCustom.source==='cart'?'pf-badge-c':selCustom.isDelivered?'pf-badge-d':'pf-badge-p'}`}>{selCustom.source==='cart'?'In Cart':selCustom.isDelivered?'Delivered':'In Progress'}</span></div>
            {selCustom.orderId&&<div className="pf-dr"><span className="pf-dl">Order</span><span className="pf-dv" style={{fontSize:'.76rem'}}>#{selCustom.orderId}</span></div>}
            {selCustom.orderedAt&&<div className="pf-dr"><span className="pf-dl">Ordered</span><span className="pf-dv">{fmt(selCustom.orderedAt)}</span></div>}
            {selCustom.custom_ingredients?.length>0&&(
              <>
                <p className="pf-ms">Ingredients</p>
                <table style={{width:'100%',fontSize:'.84rem',borderCollapse:'collapse'}}>
                  <thead><tr style={{background:'#fff3f1'}}><th style={{padding:'8px 12px',textAlign:'left',color:'#7a3a3a',fontWeight:700}}>Ingredient</th><th style={{padding:'8px 12px',textAlign:'right',color:'#7a3a3a',fontWeight:700}}>Amount</th></tr></thead>
                  <tbody>{selCustom.custom_ingredients.map((g,i)=><tr key={i} style={{borderBottom:'1px solid #fde8e8'}}><td style={{padding:'8px 12px'}}>{g.name}</td><td style={{padding:'8px 12px',textAlign:'right'}}>{g.quantity} {g.unit}</td></tr>)}</tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Address modal ── */}
      {addrModal && (
        <div className="pf-ov" onClick={()=>setAddrModal(false)}>
          <div className="pf-mo" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
            <button className="pf-mo-x" onClick={()=>setAddrModal(false)}>✕</button>
            <h3 className="pf-mo-title">{editAddrId?'Edit Address':'Add New Address'}</h3>
            <div className="pf-fg"><label className="pf-label">Label (e.g. Home, Work)</label><input className="pf-input" value={addrForm.label} onChange={e=>setAddrForm(p=>({...p,label:e.target.value}))} placeholder="Home"/></div>
            <div className="pf-form-row">
              <div className="pf-fg"><label className="pf-label">Full Name <span>*</span></label><input className="pf-input" value={addrForm.name} onChange={e=>setAddrForm(p=>({...p,name:e.target.value}))} placeholder="Your name"/></div>
              <div className="pf-fg"><label className="pf-label">Phone</label><input className="pf-input" value={addrForm.phone} onChange={e=>setAddrForm(p=>({...p,phone:e.target.value}))} placeholder="+94 77 123 4567"/></div>
            </div>
            <div className="pf-fg"><label className="pf-label">Street Address <span>*</span></label><input className="pf-input" value={addrForm.address} onChange={e=>setAddrForm(p=>({...p,address:e.target.value}))} placeholder="24/A, Vajira Road"/></div>
            <div className="pf-form-row">
              <div className="pf-fg"><label className="pf-label">City <span>*</span></label><input className="pf-input" value={addrForm.city} onChange={e=>setAddrForm(p=>({...p,city:e.target.value}))} placeholder="Colombo"/></div>
              <div className="pf-fg"><label className="pf-label">Postal Code</label><input className="pf-input" value={addrForm.postalCode} onChange={e=>setAddrForm(p=>({...p,postalCode:e.target.value}))} placeholder="10300"/></div>
            </div>
            <div style={{display:'flex',gap:12,marginTop:4}}>
              <button className="pf-btn" onClick={saveAddr}>{editAddrId?'Save Changes':'Add Address'}</button>
              <button className="pf-btn-sm" style={{padding:'10px 22px'}} onClick={()=>setAddrModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Page ══ */}
      <div className="pf-page">
        <div className="pf-hero">
          <h1>My Account</h1>
          <p className="pf-hero-sub">Manage your profile, orders &amp; preferences</p>
        </div>

        <div className="pf-body">
          <CustomerSidebar customer={customer} setCustomer={setCustomer} activeTab={activeTab} setActiveTab={setActiveTab}/>

          <div className="pf-card">

            {/* ACCOUNT */}
            {(activeTab==='account'||activeTab==='password') && (
              <>
                <h2 className="pf-card-title">Account Details</h2>
                {success&&<div className="pf-ok">{success}</div>}
                {error&&<div className="pf-err">{error}</div>}
                <form onSubmit={handleSave}>
                  <div className="pf-form-row">
                    <div className="pf-fg"><label className="pf-label">First name <span>*</span></label><input className="pf-input" type="text" value={formData.firstName} onChange={e=>setFormData(p=>({...p,firstName:e.target.value}))} required/></div>
                    <div className="pf-fg"><label className="pf-label">Last name <span>*</span></label><input className="pf-input" type="text" value={formData.lastName} onChange={e=>setFormData(p=>({...p,lastName:e.target.value}))} required/></div>
                  </div>
                  <div className="pf-fg"><label className="pf-label">Display name <span>*</span></label><input className="pf-input" type="text" value={formData.displayName} onChange={e=>setFormData(p=>({...p,displayName:e.target.value}))} required/><span className="pf-hint">How your name appears in reviews.</span></div>
                  <div className="pf-fg"><label className="pf-label">Email address <span>*</span></label><input className="pf-input" type="email" value={formData.email} onChange={e=>setFormData(p=>({...p,email:e.target.value}))} required/></div>
                  <div className="pf-sep">Password Change</div>
                  <div className="pf-fg"><label className="pf-label" style={{textTransform:'none',letterSpacing:0,fontWeight:600}}>Current password <em style={{fontWeight:400,color:'#a07070'}}>(leave blank to keep unchanged)</em></label><input className="pf-input" type="password" value={formData.currentPassword} onChange={e=>setFormData(p=>({...p,currentPassword:e.target.value}))}/></div>
                  <div className="pf-fg"><label className="pf-label" style={{textTransform:'none',letterSpacing:0,fontWeight:600}}>New password <em style={{fontWeight:400,color:'#a07070'}}>(leave blank to keep unchanged)</em></label><input className="pf-input" type="password" value={formData.newPassword} onChange={e=>setFormData(p=>({...p,newPassword:e.target.value}))}/></div>
                  <div className="pf-fg"><label className="pf-label">Confirm new password</label><input className="pf-input" type="password" value={formData.confirmNewPassword} onChange={e=>setFormData(p=>({...p,confirmNewPassword:e.target.value}))}/></div>
                  <button type="submit" className="pf-btn">Save Changes</button>
                </form>
              </>
            )}

            {/* ORDERS */}
            {activeTab==='orders' && (
              <>
                <h2 className="pf-card-title">My Orders</h2>
                <div className="pf-filter-row">
                  {[{k:'all',l:'All'},{k:'processing',l:'In Progress'},{k:'delivered',l:'Delivered'}].map(f=>(
                    <button key={f.k} className={`pf-filter-btn${orderFilter===f.k?' act':''}`} onClick={()=>setOrderFilter(f.k)}>{f.l}</button>
                  ))}
                </div>
                {loading?<div className="pf-loading">Loading orders…</div>:filtered.length===0?(
                  <div className="pf-empty"><strong>No orders found</strong>{orderFilter==='all'&&<><br/><Link to="/cakes" className="pf-link">Browse Cakes</Link></>}</div>
                ):(
                  <>
                    <table className="pf-table">
                      <thead><tr><th>Order</th><th>Date</th><th>Delivery Date</th><th>Items</th><th>Status</th><th>Total</th></tr></thead>
                      <tbody>
                        {filtered.map(o=>(
                          <tr key={o._id} className="click" onClick={()=>setSelOrder(o)}>
                            <td style={{fontWeight:700,color:'#e8857a',fontSize:'.76rem'}}>#{o._id.slice(-8)}</td>
                            <td>{fmt(o.createdAt)}</td>
                            <td>{fmt(o.deliveryDate)}</td>
                            <td style={{color:'#7a3a3a'}}>{(o.product?.length||0)+(o.customize?.length||0)}</td>
                            <td><span className={`pf-badge ${o.isDelivered?'pf-badge-d':'pf-badge-p'}`}>{o.isDelivered?'Delivered':'In Progress'}</span></td>
                            <td style={{fontWeight:700}}>Rs. {o.totalPrice?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="pf-hint-row">Click any row to view full order details.</p>
                    {orders.length>0&&<div className="pf-chips">
                      <div className="pf-chip" style={{background:'#fff3f1',color:'#7a3a3a'}}>Total: {orders.length}</div>
                      <div className="pf-chip" style={{background:'#fff3cd',color:'#856404'}}>In Progress: {orders.filter(o=>!o.isDelivered).length}</div>
                      <div className="pf-chip" style={{background:'#d1e7dd',color:'#0f5132'}}>Delivered: {orders.filter(o=>o.isDelivered).length}</div>
                    </div>}
                  </>
                )}
              </>
            )}

            {/* CUSTOM CAKES */}
            {activeTab==='customizes' && (
              <>
                <h2 className="pf-card-title">My Custom Cakes</h2>
                {loading?<div className="pf-loading">Loading…</div>:(
                  <>
                    {cartCustoms.length>0&&(<><p className="pf-sub-lbl">In your cart</p><div className="pf-cg" style={{marginBottom:24}}>{cartCustoms.map((it,i)=>(<div key={i} className="pf-cc" onClick={()=>setSelCustom({...it,source:'cart'})}><div style={{fontSize:'2rem',marginBottom:6}}>🎂</div><div className="pf-cc-title">Custom Cake</div><span className="pf-badge pf-badge-c">In Cart</span><div className="pf-cc-price">Rs. {Number(it.custom_price).toFixed(2)}</div><div style={{fontSize:'.74rem',color:'#a07070',marginTop:4}}>Click for details</div></div>))}</div></>)}
                    {customizes.length>0&&(<><p className="pf-sub-lbl">Previously ordered</p><div className="pf-cg">{customizes.map((it,i)=>(<div key={i} className="pf-cc" onClick={()=>setSelCustom(it)}><div style={{fontSize:'2rem',marginBottom:6}}>🎂</div><div className="pf-cc-title">Custom Cake</div><span className={`pf-badge ${it.isDelivered?'pf-badge-d':'pf-badge-p'}`}>{it.isDelivered?'Delivered':'In Progress'}</span><div className="pf-cc-price">Rs. {Number(it.custom_price).toFixed(2)}</div><div style={{fontSize:'.74rem',color:'#a07070',marginTop:4}}>{fmt(it.orderedAt)} · Click for details</div></div>))}</div></>)}
                    {!cartCustoms.length&&!customizes.length&&<div className="pf-empty"><strong>No custom cakes yet</strong>Design your own!<br/><Link to="/customizes" className="pf-link">Customize a Cake</Link></div>}
                  </>
                )}
              </>
            )}

            {/* REVIEWS */}
            {activeTab==='reviews' && (
              <>
                <h2 className="pf-card-title">My Reviews</h2>
                {loading?<div className="pf-loading">Loading…</div>:reviews.length===0?(
                  <div className="pf-empty"><strong>No reviews posted yet</strong>You can review products after they are delivered.<br/><Link to="/cakes" className="pf-link">Browse Cakes</Link></div>
                ):(
                  <div className="pf-rl">
                    {reviews.map((rv,i)=>(
                      <div key={i} className="pf-rc">
                        <div className="pf-rc-hdr"><div><div className="pf-rc-prod">Product review</div><Stars n={rv.rating}/></div><div className="pf-rc-date">{fmt(rv.createdAt)}</div></div>
                        <p className="pf-rc-txt">"{rv.feedback_text||rv.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ADDRESSES */}
            {activeTab==='addresses' && (
              <>
                <h2 className="pf-card-title">My Addresses</h2>
                {addresses.length>0&&(
                  <div className="pf-al">
                    {addresses.map(a=>(
                      <div key={a.id} className={`pf-ac${a.isDefault?' def':''}`}>
                        <div className="pf-ac-info">
                          <div className="pf-ac-name">{a.label||'Address'} — {a.name}</div>
                          <div className="pf-ac-line">{a.address}<br/>{a.city}{a.postalCode?`, ${a.postalCode}`:''}{a.phone&&<><br/>{a.phone}</>}</div>
                          {a.isDefault&&<span className="pf-ac-def-badge">Default</span>}
                        </div>
                        <div className="pf-ac-actions">
                          {!a.isDefault&&<button className="pf-btn-sm" onClick={()=>setDef(a.id)}>Set Default</button>}
                          <button className="pf-btn-sm" onClick={()=>openEdit(a)}>Edit</button>
                          <button className="pf-btn-danger" onClick={()=>delAddr(a.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="pf-add-btn" onClick={openAdd}>
                  <span style={{fontSize:'1.3rem',lineHeight:1}}>＋</span> Add New Address
                </button>
                {addresses.length===0&&<p style={{fontSize:'.82rem',color:'#a07070',marginTop:12,fontStyle:'italic'}}>No addresses saved. Add one to speed up checkout.</p>}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;

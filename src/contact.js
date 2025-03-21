import React, { useState } from "react";
import {FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Footer } from "./home";

const Contact = () => {
  const [message, setMessage] = useState(""); // حالة لحفظ الرسالة
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("تم إرسال رسالتك بنجاح!");
    setFormData({ name: "", email: "", message: "" }); // تفريغ الحقول
    setTimeout(() => setMessage(""), 3000); // إخفاء الرسالة بعد 3 ثوانٍ
  };

  return (
    <>
    <div style={{ marginTop: "50px", padding: "10px" ,direction:"rtl",maxWidth:'800px' }} className="container ">
      <h2 className="mb-4">تواصل معنا</h2>
      {message && <div className="alert alert-success">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">الاسم</label>
          <input 
            type="text" 
            className="form-control" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">البريد الإلكتروني</label>
          <input 
            type="email" 
            className="form-control" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">رسالتك</label>
          <textarea 
            className="form-control" 
            name="message" 
            rows="4" 
            value={formData.message} 
            onChange={handleChange} 
            required 
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">إرسال</button>
      </form>

      <div className="mt-4">
        <p><FaMapMarkerAlt />شارع 15، سوهاج</p>
        <p><FaMapMarkerAlt />شارع احمد بدوي، المراغة</p>
        <p><FaMapMarkerAlt />شارع عبدالمنعم رياض، المراغة</p>
        <p><FaWhatsapp />201103412849+</p>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Contact;

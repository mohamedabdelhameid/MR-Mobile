import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div style={{ margin: "10%", padding: "10px" }} className="container ">
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
        <p><FaMapMarkerAlt /> العنوان: القاهرة، مصر</p>
        <p><FaPhone /> الهاتف: 0123456789</p>
        <p><FaEnvelope /> البريد الإلكتروني: info@example.com</p>
      </div>
    </div>
  );
};

export default Contact;

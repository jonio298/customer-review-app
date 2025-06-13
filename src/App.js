import React, { useState } from 'react';
import './index.css';
import logo from './logo.png';

function App() {
  const [formData, setFormData] = useState({
    customerName: '',
    techName: 'Jonathan',
    rating: 'Excellent',
    comments: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));

    try {
      const res = await fetch('https://formsubmit.co/YOUR_EMAIL@example.com', {
        method: 'POST',
        body: form,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        setStatus('✅ Thanks for your review!');
        setFormData({
          customerName: '',
          techName: 'Jonathan',
          rating: 'Excellent',
          comments: ''
        });
      } else {
        setStatus('⚠️ Something went wrong.');
      }
    } catch {
      setStatus('❌ Network error.');
    }
  };

  return (
    <div className="container dark">
      <div className="logo-wrapper">
        <img src={logo} alt="KIT Logo" className="logo" />
      </div>

      <h1>We'd love your feedback!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Your Name:
          <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required />
        </label>
        <label>
          Tech's Name:
          <input type="text" name="techName" value={formData.techName} readOnly />
        </label>
        <label>
          Rating:
          <select name="rating" value={formData.rating} onChange={handleChange}>
            <option>Excellent</option>
            <option>Good</option>
            <option>Okay</option>
            <option>Poor</option>
          </select>
        </label>
        <label>
          Comments:
          <textarea name="comments" rows="4" value={formData.comments} onChange={handleChange} />
        </label>
        <button type="submit">Send Review</button>
      </form>
      <p className={`status-message ${status && 'fade-in'}`}>{status}</p>
    </div>
  );
}

export default App;

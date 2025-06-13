import React, { useState } from 'react';
import './index.css';
import logo from './logo.png';
import Game from './Game';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const defaultTech = queryParams.get('techName') || 'Jonathan';

  const [formData, setFormData] = useState({
    customerName: '',
    techName: defaultTech,
    rating: 'Excellent',
    comments: ''
  });

  const [status, setStatus] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [clickCount, setClickCount] = useState(0);

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
          techName: defaultTech,
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

  const handleLogoClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setFormVisible(false);
        setTimeout(() => setClickCount(0), 1000);
      } else {
        setTimeout(() => setClickCount(0), 1000);
      }
      return newCount;
    });
  };

  const handleBackToForm = () => {
    setFormVisible(true);
    setStatus('');
  };

  return (
    <div className="container dark">
      <div className="logo-wrapper left">
        <img
          src={logo}
          alt="KIT Logo"
          className="logo large"
          onClick={handleLogoClick}
        />
      </div>

      {formVisible ? (
        <>
          <h1>We'd love your feedback!</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Your Name:
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Tech's Name:
              <input
                type="text"
                name="techName"
                value={formData.techName}
                readOnly
              />
            </label>
            <label>
              Rating:
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Okay</option>
                <option>Poor</option>
              </select>
            </label>
            <label>
              Comments:
              <textarea
                name="comments"
                rows="4"
                value={formData.comments}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Send Review</button>
          </form>
          <p className={`status-message ${status && 'fade-in'}`}>{status}</p>
        </>
      ) : (
        <div className="easter-egg-game">
          <h2>You found the hidden game! 🎉</h2>
          <p>(Click the dot as many times as you can)</p>
          <Game />
          <button onClick={handleBackToForm}>Back to Form</button>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './KundliForm.css';
import { useLanguage } from '../context/LanguageContext';

function KundliForm() {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    time: '',
    place: '',
  });

  const [prediction, setPrediction] = useState('');
  const [message, setMessage] = useState('');
  const [chatResponses, setChatResponses] = useState([]);

  const labels = {
    en: {
      title: "🪐 Vedic Astrology Prediction",
      name: "Name",
      dob: "Date of Birth",
      time: "Time of Birth",
      place: "Place of Birth",
      submit: "Get Prediction",
      prediction: "🔮 Prediction:",
      ask: "Ask about your prediction...",
      send: "Send",
    },
    kn: {
      title: "🪐 ಜ್ಯೋತಿಷ್ಯ ಭವಿಷ್ಯವಾಣಿ",
      name: "ಹೆಸರು",
      dob: "ಹುಟ್ತಿದ ದಿನಾಂಕ",
      time: "ಹುಟ್ತಿದ ಸಮಯ",
      place: "ಹುಟ್ತಿದ ಸ್ಥಳ",
      submit: "ಭವಿಷ್ಯ ನೋಡಿ",
      prediction: "🔮 ಭವಿಷ್ಯವಾಣಿ:",
      ask: "ಭವಿಷ್ಯವಾಣಿ ಬಗ್ಗೆ ಕೇಳಿ...",
      send: "ಕಳುಹಿಸಿ",
    },
  };

  const text = labels[language];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction("Generating...");
    setChatResponses([]);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error:', error);
      setPrediction('Something went wrong while generating the prediction.');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { user: message };
    setChatResponses(prev => [...prev, newMessage]);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language, question: message }),
      });

      const data = await response.json();
      setChatResponses(prev => [...prev, { bot: data.answer }]);
    } catch (error) {
      console.error('Error:', error);
      setChatResponses(prev => [...prev, { bot: "Something went wrong." }]);
    }
  };

  return (
    <div className="kundli-form-container">
      <h2>{text.title}</h2>
      <form onSubmit={handleSubmit}>
        <label>{text.name}
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>{text.dob}
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </label>
        <label>{text.time}
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </label>
        <label>{text.place}
          <input type="text" name="place" value={formData.place} onChange={handleChange} required />
        </label>
        <button type="submit">{text.submit}</button>
      </form>

      {prediction && (
        <>
          {/* Chat Box */}
          <div className="chat-box">
            <input
              type="text"
              placeholder={text.ask}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>{text.send}</button>
          </div>

          {/* Chat History */}
          <div className="chat-history">
            {chatResponses.map((msg, idx) => (
              <div key={idx} className={msg.user ? "user-msg" : "bot-msg"}>
                {msg.user || msg.bot}
              </div>
            ))}
          </div>

          {/* Prediction */}
          <div className="prediction-box">
            <h3>{text.prediction}</h3>
            <p>{prediction}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default KundliForm;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Mood.css';

const Mood = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [factors, setFactors] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  const moodOptions = [
    { id: 'happy', emoji: '😊', label: { en: 'Happy', am: 'ደስተኛ' }, score: 5, color: '#10B981' },
    { id: 'calm', emoji: '😌', label: { en: 'Calm', am: 'ሰላም' }, score: 4, color: '#3B82F6' },
    { id: 'grateful', emoji: '🙏', label: { en: 'Grateful', am: 'አመስጋኝ' }, score: 4, color: '#8B5CF6' },
    { id: 'okay', emoji: '😐', label: { en: 'Okay', am: 'እሺ' }, score: 3, color: '#F59E0B' },
    { id: 'tired', emoji: '😴', label: { en: 'Tired', am: 'ደክሟል' }, score: 2, color: '#6B7280' },
    { id: 'sad', emoji: '😔', label: { en: 'Sad', am: 'አዝናለሁ' }, score: 2, color: '#F97316' },
    { id: 'anxious', emoji: '😰', label: { en: 'Anxious', am: 'ተጨንቄ' }, score: 1, color: '#EF4444' },
    { id: 'angry', emoji: '😠', label: { en: 'Angry', am: 'ተቆጥቻለሁ' }, score: 1, color: '#DC2626' }
  ];

  const factorOptions = ['sleep', 'stress', 'exercise', 'social', 'food', 'work', 'weather'];

  const factorLabels = {
    en: { sleep: '😴 Sleep', stress: '😰 Stress', exercise: '💪 Exercise', social: '👥 Social', food: '🍔 Food', work: '💼 Work', weather: '☀️ Weather' },
    am: { sleep: '😴 እንቅልፍ', stress: '😰 ጭንቀት', exercise: '💪 እንቅስቃሴ', social: '👥 ማህበራዊ', food: '🍔 ምግብ', work: '💼 ስራ', weather: '☀️ የአየር ሁኔታ' }
  };

  useEffect(() => {
    fetchTodayMood();
  }, []);

  const fetchTodayMood = async () => {
    try {
      const response = await api.get('/mood/today');
      if (response.data) {
        setSelectedMood(response.data.mood);
        setIntensity(response.data.intensity || 3);
        setFactors(response.data.factors || []);
        setNote(response.data.note || '');
      }
    } catch (error) {
      console.error('Error fetching mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mood/log', { mood: selectedMood, intensity, factors, note });
      alert('Mood logged successfully!');
      fetchTodayMood();
    } catch (error) {
      console.error('Error logging mood:', error);
    }
  };

  const toggleFactor = (factor) => {
    if (factors.includes(factor)) setFactors(factors.filter(f => f !== factor));
    else setFactors([...factors, factor]);
  };

  const t = {
    en: { title: 'Mood Tracker', subtitle: 'How are you feeling today?', selectMood: 'Select your mood', intensity: 'Intensity', intensityLow: 'Low', intensityHigh: 'High', factors: 'What factors affected your mood?', note: 'Add a note (optional)', save: 'Save Mood Log', history: 'Mood History' },
    am: { title: 'ስሜት መከታተያ', subtitle: 'ዛሬ እንዴት ይሰማዎታል?', selectMood: 'ስሜትዎን ይምረጡ', intensity: 'መጠን', intensityLow: 'ዝቅተኛ', intensityHigh: 'ከፍተኛ', factors: 'ስሜትዎ ላይ ተጽዕኖ ያሳደሩ ነገሮች?', note: 'ማስታወሻ ያክሉ (አማራጭ)', save: 'ስሜት ያስቀምጡ', history: 'የስሜት ታሪክ' }
  };

  const text = t[language];

  if (loading) return <div className="mood-loading"><div className="spinner"></div></div>;

  return (
    <div className="mood-container">
      <div className="mood-content">
        <h1>😊 {text.title}</h1>
        <p>{text.subtitle}</p>

        <form onSubmit={handleSubmit} className="mood-form">
          <div className="mood-selector">
            <label>{text.selectMood}</label>
            <div className="mood-options">
              {moodOptions.map(mood => (
                <button key={mood.id} type="button" className={`mood-option ${selectedMood === mood.id ? 'selected' : ''}`} onClick={() => setSelectedMood(mood.id)} style={{ '--mood-color': mood.color }}>
                  <span className="mood-emoji-large">{mood.emoji}</span>
                  <span>{mood.label[language]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="intensity-selector">
            <label>{text.intensity}: {intensity}/5</label>
            <input type="range" min="1" max="5" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} />
            <div className="intensity-labels"><span>{text.intensityLow}</span><span>{text.intensityHigh}</span></div>
          </div>

          <div className="factors-selector">
            <label>{text.factors}</label>
            <div className="factors-grid">
              {factorOptions.map(factor => (
                <button key={factor} type="button" className={`factor-btn ${factors.includes(factor) ? 'selected' : ''}`} onClick={() => toggleFactor(factor)}>
                  {factorLabels[language][factor]}
                </button>
              ))}
            </div>
          </div>

          <div className="note-input">
            <label>{text.note}</label>
            <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What made you feel this way?" />
          </div>

          <button type="submit" className="submit-btn">{text.save}</button>
        </form>
      </div>
    </div>
  );
};

export default Mood;

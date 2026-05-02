import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState({ streak: 0, totalEntries: 0, avgMood: 0 });
  const [recentEntries, setRecentEntries] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, entriesRes, moodRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/journal/recent'),
        api.get('/mood/today')
      ]);
      setStats(statsRes.data);
      setRecentEntries(entriesRes.data);
      setTodayMood(moodRes.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickLogMood = async (mood) => {
    try {
      await api.post('/mood/log', { mood: mood.id, score: mood.score });
      fetchDashboardData();
    } catch (error) {
      console.error('Error logging mood:', error);
    }
  };

  const moods = [
    { id: 'happy', emoji: '😊', label: { en: 'Happy', am: 'ደስተኛ' }, score: 5, color: '#10B981' },
    { id: 'calm', emoji: '😌', label: { en: 'Calm', am: 'ሰላም' }, score: 4, color: '#3B82F6' },
    { id: 'grateful', emoji: '🙏', label: { en: 'Grateful', am: 'አመስጋኝ' }, score: 4, color: '#8B5CF6' },
    { id: 'okay', emoji: '😐', label: { en: 'Okay', am: 'እሺ' }, score: 3, color: '#F59E0B' },
    { id: 'tired', emoji: '😴', label: { en: 'Tired', am: 'ደክሟል' }, score: 2, color: '#6B7280' },
    { id: 'sad', emoji: '😔', label: { en: 'Sad', am: 'አዝናለሁ' }, score: 2, color: '#F97316' },
    { id: 'anxious', emoji: '😰', label: { en: 'Anxious', am: 'ተጨንቄ' }, score: 1, color: '#EF4444' },
    { id: 'angry', emoji: '😠', label: { en: 'Angry', am: 'ተቆጥቻለሁ' }, score: 1, color: '#DC2626' }
  ];

  const t = {
    en: { welcome: 'Welcome back', moodLog: 'How are you feeling today?', streak: 'Day Streak', entries: 'Journal Entries', avgMood: 'Average Mood', recent: 'Recent Entries', noEntries: 'No entries yet', writeFirst: 'Write your first entry', viewAll: 'View All' },
    am: { welcome: 'እንኳን ደህና መጡ', moodLog: 'ዛሬ እንዴት ይሰማዎታል?', streak: 'ቀን ቀጣይነት', entries: 'ማስታወሻዎች', avgMood: 'አማካይ ስሜት', recent: 'የቅርብ ጊዜ ማስታወሻዎች', noEntries: 'እስካሁን ማስታወሻ የለም', writeFirst: 'የመጀመሪያ ማስታወሻዎን ይጻፉ', viewAll: 'ሁሉንም ይመልከቱ' }
  };

  const text = t[language];

  if (loading) return <div className="dashboard-loading"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>{text.welcome}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>{text.moodLog}</p>
        </div>

        {/* Quick Mood Log */}
        <div className="quick-mood-section">
          <h2>😊 {text.moodLog}</h2>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button key={mood.id} className="mood-btn" onClick={() => quickLogMood(mood)} style={{ '--mood-color': mood.color }}>
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{stats.streak}</div>
            <div className="stat-label">{text.streak}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{stats.totalEntries}</div>
            <div className="stat-label">{text.entries}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.avgMood}</div>
            <div className="stat-label">{text.avgMood}/5</div>
          </div>
        </div>

        {/* Recent Journal Entries */}
        <div className="recent-section">
          <div className="section-header">
            <h2>📖 {text.recent}</h2>
            <Link to="/journal" className="view-link">{text.viewAll} →</Link>
          </div>
          {recentEntries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📔</div>
              <p>{text.noEntries}</p>
              <Link to="/journal" className="write-btn">✏️ {text.writeFirst}</Link>
            </div>
          ) : (
            <div className="entries-list">
              {recentEntries.map(entry => (
                <div key={entry._id} className="entry-item">
                  <div className="entry-header">
                    <span className="entry-mood">{entry.moodEmoji || '📝'}</span>
                    <h3>{entry.title}</h3>
                    <span className="entry-date">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="entry-preview">{entry.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

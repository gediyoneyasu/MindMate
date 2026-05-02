import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({ trend: [], distribution: [], stats: {}, insights: [] });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    if (!user) navigate('/auth');
    else fetchAnalytics();
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/analytics?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodLabels = {
    en: { happy: 'Happy', calm: 'Calm', grateful: 'Grateful', okay: 'Okay', sad: 'Sad', anxious: 'Anxious', angry: 'Angry', tired: 'Tired' },
    am: { happy: 'ደስተኛ', calm: 'ሰላም', grateful: 'አመስጋኝ', okay: 'እሺ', sad: 'አዝናለሁ', anxious: 'ተጨንቄ', angry: 'ተቆጥቻለሁ', tired: 'ደክሟል' }
  };

  const moodEmojis = { happy: '😊', calm: '😌', grateful: '🙏', okay: '😐', sad: '😔', anxious: '😰', angry: '😠', tired: '😴' };

  const t = {
    en: { title: 'Analytics', subtitle: 'Track your mental health journey', timeRange: 'Time Range', last7Days: 'Last 7 Days', last30Days: 'Last 30 Days', last90Days: 'Last 90 Days', moodTrend: 'Mood Trend', moodDistribution: 'Mood Distribution', keyInsights: 'Key Insights', avgMood: 'Average Mood', bestDay: 'Best Day', totalEntries: 'Total Entries', streak: 'Current Streak', improvement: 'Improvement', noData: 'No data available yet. Start logging your mood!' },
    am: { title: 'ትንተና', subtitle: 'የአእምሮ ጤና ጉዞዎን ይከታተሉ', timeRange: 'የጊዜ ክልል', last7Days: 'ያለፉ 7 ቀናት', last30Days: 'ያለፉ 30 ቀናት', last90Days: 'ያለፉ 90 ቀናት', moodTrend: 'የስሜት አዝማሚያ', moodDistribution: 'የስሜት ስርጭት', keyInsights: 'ቁልፍ ግንዛቤዎች', avgMood: 'አማካይ ስሜት', bestDay: 'ምርጥ ቀን', totalEntries: 'ጠቅላላ ማስታወሻዎች', streak: 'የአሁኑ ቀጣይነት', improvement: 'ማሻሻያ', noData: 'እስካሁን ምንም ውሂብ የለም። ስሜትዎን መመዝገብ ይጀምሩ!' }
  };

  const text = t[language];

  if (loading) return <div className="analytics-loading"><div className="spinner"></div></div>;

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        <div className="analytics-header">
          <h1>📊 {text.title}</h1>
          <p>{text.subtitle}</p>
        </div>

        <div className="time-range-selector">
          <label>{text.timeRange}:</label>
          <div className="range-buttons">
            <button className={timeRange === '7' ? 'active' : ''} onClick={() => setTimeRange('7')}>{text.last7Days}</button>
            <button className={timeRange === '30' ? 'active' : ''} onClick={() => setTimeRange('30')}>{text.last30Days}</button>
            <button className={timeRange === '90' ? 'active' : ''} onClick={() => setTimeRange('90')}>{text.last90Days}</button>
          </div>
        </div>

        {analytics.trend.length === 0 ? (
          <div className="empty-analytics">
            <div className="empty-icon">📈</div>
            <p>{text.noData}</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="analytics-stats">
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{analytics.stats.avgMood || 0}</div>
                <div className="stat-label">{text.avgMood}/5</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{analytics.stats.bestDay || '--'}</div>
                <div className="stat-label">{text.bestDay}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-value">{analytics.stats.totalEntries || 0}</div>
                <div className="stat-label">{text.totalEntries}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">{analytics.stats.streak || 0}</div>
                <div className="stat-label">{text.streak}</div>
              </div>
            </div>

            {/* Mood Trend Chart (ASCII/SVG representation) */}
            <div className="chart-section">
              <h3>{text.moodTrend}</h3>
              <div className="trend-chart">
                {analytics.trend.map((item, idx) => (
                  <div key={idx} className="trend-bar-container">
                    <div className="trend-bar" style={{ height: `${(item.score / 5) * 100}%` }}>
                      <span className="trend-emoji">{moodEmojis[item.mood]}</span>
                    </div>
                    <span className="trend-date">{new Date(item.date).getDate()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="distribution-section">
              <h3>{text.moodDistribution}</h3>
              <div className="distribution-grid">
                {Object.entries(analytics.distribution).map(([mood, count]) => (
                  <div key={mood} className="distribution-item">
                    <span className="dist-emoji">{moodEmojis[mood]}</span>
                    <span className="dist-label">{moodLabels[language][mood]}</span>
                    <div className="dist-bar-container">
                      <div className="dist-bar" style={{ width: `${(count / analytics.trend.length) * 100}%` }}></div>
                    </div>
                    <span className="dist-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            <div className="insights-section">
              <h3>{text.keyInsights}</h3>
              <div className="insights-list">
                {analytics.insights.map((insight, idx) => (
                  <div key={idx} className="insight-card">
                    <span className="insight-icon">{insight.icon || '💡'}</span>
                    <p>{insight.text[language]}</p>
                  </div>
                ))}
                <div className="insight-card">
                  <span className="insight-icon">📈</span>
                  <p>{analytics.stats.improvement ? `Your mood improved by ${analytics.stats.improvement}% compared to previous period` : 'Keep logging to see your progress!'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;

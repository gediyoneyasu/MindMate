import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', bio: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({ totalEntries: 0, totalMoods: 0, streak: 0 });
  const [notifications, setNotifications] = useState({ emailAlerts: true, dailyReminder: true, reminderTime: '20:00' });

  useEffect(() => {
    if (!user) navigate('/auth');
    else {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/analytics/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', editForm);
      setProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure? This will permanently delete all your data.')) {
      await api.delete('/auth/account');
      logout();
      navigate('/');
    }
  };

  const handleExportData = async () => {
    const response = await api.get('/export/data');
    const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmate-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const t = {
    en: { title: 'Profile', editProfile: 'Edit Profile', save: 'Save', cancel: 'Cancel', name: 'Full Name', email: 'Email Address', phone: 'Phone Number', bio: 'Bio', memberSince: 'Member Since', stats: 'Your Stats', totalEntries: 'Journal Entries', totalMoods: 'Moods Logged', streak: 'Day Streak', preferences: 'Preferences', language: 'Language', notifications: 'Notifications', emailAlerts: 'Email Alerts', dailyReminder: 'Daily Reminder', reminderTime: 'Reminder Time', data: 'Data Management', exportData: 'Export All Data', deleteAccount: 'Delete Account' },
    am: { title: 'መገለጫ', editProfile: 'መገለጫ አርትዕ', save: 'አስቀምጥ', cancel: 'ሰርዝ', name: 'ሙሉ ስም', email: 'ኢሜይል', phone: 'ስልክ ቁጥር', bio: 'ስለኔ', memberSince: 'አባል የሆንኩበት', stats: 'የእርስዎ ስታቲስቲክስ', totalEntries: 'ማስታወሻዎች', totalMoods: 'የተመዘገቡ ስሜቶች', streak: 'የቀን ቀጣይነት', preferences: 'ምርጫዎች', language: 'ቋንቋ', notifications: 'ማሳወቂያዎች', emailAlerts: 'የኢሜይል ማንቂያዎች', dailyReminder: 'ዕለታዊ አስታዋሽ', reminderTime: 'የማስታወሻ ሰዓት', data: 'የውሂብ አስተዳደር', exportData: 'ሁሉንም ውሂብ ወደ ውጭ ላክ', deleteAccount: 'መለያ ሰርዝ' }
  };

  const text = t[language];

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h1>{text.title}</h1>
        </div>

        <div className="profile-grid">
          {/* Profile Info */}
          <div className="profile-card">
            <div className="card-header">
              <h2>{text.title}</h2>
              {!isEditing && <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ {text.editProfile}</button>}
            </div>
            {!isEditing ? (
              <div className="profile-info">
                <div><label>{text.name}:</label><span>{profile.name || user?.name}</span></div>
                <div><label>{text.email}:</label><span>{profile.email || user?.email}</span></div>
                <div><label>{text.phone}:</label><span>{profile.phone || 'Not set'}</span></div>
                <div><label>{text.bio}:</label><span>{profile.bio || 'No bio added'}</span></div>
                <div><label>{text.memberSince}:</label><span>{new Date(user?.createdAt).toLocaleDateString()}</span></div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="edit-form">
                <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder={text.name} />
                <input type="tel" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder={text.phone} />
                <textarea rows="3" value={editForm.bio || ''} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} placeholder={text.bio} />
                <div className="form-buttons">
                  <button type="submit" className="save-btn">{text.save}</button>
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>{text.cancel}</button>
                </div>
              </form>
            )}
          </div>

          {/* Stats */}
          <div className="profile-card">
            <h2>📊 {text.stats}</h2>
            <div className="stats-grid">
              <div className="stat"><div className="stat-num">{stats.totalEntries}</div><div className="stat-name">{text.totalEntries}</div></div>
              <div className="stat"><div className="stat-num">{stats.totalMoods}</div><div className="stat-name">{text.totalMoods}</div></div>
              <div className="stat"><div className="stat-num">{stats.streak}</div><div className="stat-name">{text.streak}</div></div>
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-card">
            <h2>⚙️ {text.preferences}</h2>
            <div className="preference-item">
              <label>{text.language}</label>
              <div className="lang-buttons">
                <button className={language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>English</button>
                <button className={language === 'am' ? 'active' : ''} onClick={() => changeLanguage('am')}>አማርኛ</button>
              </div>
            </div>
            <div className="preference-item">
              <label>{text.emailAlerts}</label>
              <label className="toggle"><input type="checkbox" checked={notifications.emailAlerts} onChange={() => setNotifications({...notifications, emailAlerts: !notifications.emailAlerts})} /><span className="toggle-slider"></span></label>
            </div>
            <div className="preference-item">
              <label>{text.dailyReminder}</label>
              <label className="toggle"><input type="checkbox" checked={notifications.dailyReminder} onChange={() => setNotifications({...notifications, dailyReminder: !notifications.dailyReminder})} /><span className="toggle-slider"></span></label>
            </div>
            <div className="preference-item">
              <label>{text.reminderTime}</label>
              <input type="time" value={notifications.reminderTime} onChange={(e) => setNotifications({...notifications, reminderTime: e.target.value})} className="time-input" />
            </div>
          </div>

          {/* Data Management */}
          <div className="profile-card">
            <h2>💾 {text.data}</h2>
            <button className="export-btn" onClick={handleExportData}>📥 {text.exportData}</button>
            <button className="delete-btn" onClick={handleDeleteAccount}>🗑️ {text.deleteAccount}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

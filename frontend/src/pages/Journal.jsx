import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Journal.css';

const Journal = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: '', tags: [] });
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    if (!user) navigate('/auth');
    else fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    try {
      const response = await api.get('/journal');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    try {
      await api.post('/journal', newEntry);
      setShowNewEntry(false);
      setNewEntry({ title: '', content: '', mood: '', tags: [] });
      fetchEntries();
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Delete this entry?')) {
      await api.delete(`/journal/${id}`);
      fetchEntries();
    }
  };

  const moods = [
    { id: 'happy', emoji: '😊', label: { en: 'Happy', am: 'ደስተኛ' } },
    { id: 'calm', emoji: '😌', label: { en: 'Calm', am: 'ሰላም' } },
    { id: 'grateful', emoji: '🙏', label: { en: 'Grateful', am: 'አመስጋኝ' } },
    { id: 'okay', emoji: '😐', label: { en: 'Okay', am: 'እሺ' } },
    { id: 'sad', emoji: '😔', label: { en: 'Sad', am: 'አዝናለሁ' } },
    { id: 'anxious', emoji: '😰', label: { en: 'Anxious', am: 'ተጨንቄ' } }
  ];

  const t = {
    en: { title: 'Journal', newEntry: 'New Entry', search: 'Search entries...', filterByMood: 'Filter by mood', allMoods: 'All Moods', noEntries: 'No journal entries yet', writeFirst: 'Write your first entry', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', titlePlaceholder: 'Entry title...', contentPlaceholder: 'Write your thoughts...', selectMood: 'Select mood' },
    am: { title: 'ማስታወሻ', newEntry: 'አዲስ ማስታወሻ', search: 'ማስታወሻ ፈልግ...', filterByMood: 'በስሜት አጣራ', allMoods: 'ሁሉም ስሜቶች', noEntries: 'እስካሁን ማስታወሻ የለም', writeFirst: 'የመጀመሪያ ማስታወሻዎን ይጻፉ', edit: 'አርትዕ', delete: 'ሰርዝ', save: 'አስቀምጥ', cancel: 'ሰርዝ', titlePlaceholder: 'ርዕስ...', contentPlaceholder: 'ሀሳብዎን ይጻፉ...', selectMood: 'ስሜት ይምረጡ' }
  };

  const text = t[language];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  if (loading) return <div className="journal-loading"><div className="spinner"></div></div>;

  return (
    <div className="journal-container">
      <div className="journal-content">
        <div className="journal-header">
          <h1>📝 {text.title}</h1>
          <button className="new-entry-btn" onClick={() => setShowNewEntry(true)}>+ {text.newEntry}</button>
        </div>

        <div className="journal-controls">
          <input type="text" className="search-input" placeholder={text.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select className="mood-filter" value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
            <option value="">{text.allMoods}</option>
            {moods.map(mood => <option key={mood.id} value={mood.id}>{mood.emoji} {mood.label[language]}</option>)}
          </select>
        </div>

        {showNewEntry && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{text.newEntry}</h2>
              <form onSubmit={handleCreateEntry}>
                <input type="text" placeholder={text.titlePlaceholder} value={newEntry.title} onChange={(e) => setNewEntry({...newEntry, title: e.target.value})} required />
                <select value={newEntry.mood} onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})} required>
                  <option value="">{text.selectMood}</option>
                  {moods.map(mood => <option key={mood.id} value={mood.id}>{mood.emoji} {mood.label[language]}</option>)}
                </select>
                <textarea rows="8" placeholder={text.contentPlaceholder} value={newEntry.content} onChange={(e) => setNewEntry({...newEntry, content: e.target.value})} required />
                <div className="modal-buttons">
                  <button type="submit" className="save-btn">{text.save}</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowNewEntry(false)}>{text.cancel}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {filteredEntries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📔</div>
            <p>{text.noEntries}</p>
            <button className="write-btn" onClick={() => setShowNewEntry(true)}>✏️ {text.writeFirst}</button>
          </div>
        ) : (
          <div className="entries-list">
            {filteredEntries.map(entry => (
              <div key={entry._id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-mood">{entry.moodEmoji || '📝'}</span>
                  <h3>{entry.title}</h3>
                  <span className="entry-date">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  <div className="entry-actions">
                    <button className="edit-btn" onClick={() => setEditingEntry(entry)}>✏️ {text.edit}</button>
                    <button className="delete-btn" onClick={() => handleDeleteEntry(entry._id)}>🗑️ {text.delete}</button>
                  </div>
                </div>
                <p className="entry-content">{entry.content}</p>
                {entry.tags?.length > 0 && <div className="entry-tags">{entry.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;

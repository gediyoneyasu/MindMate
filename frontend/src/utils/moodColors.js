export const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#10B981', score: 5 },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#3B82F6', score: 4 },
  { id: 'grateful', emoji: '🙏', label: 'Grateful', color: '#8B5CF6', score: 4 },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#F59E0B', score: 3 },
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#6B7280', score: 2 },
  { id: 'sad', emoji: '😔', label: 'Sad', color: '#F97316', score: 2 },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#EF4444', score: 1 },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#DC2626', score: 1 }
];

export const getMoodEmoji = (moodId) => {
  const mood = moods.find(m => m.id === moodId);
  return mood?.emoji || '😐';
};

export const getMoodColor = (moodId) => {
  const mood = moods.find(m => m.id === moodId);
  return mood?.color || '#6B7280';
};

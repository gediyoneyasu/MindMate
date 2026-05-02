import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './Therapist.css';

const Therapist = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [showMeditation, setShowMeditation] = useState(false);
  const [meditationMinutes, setMeditationMinutes] = useState(3);
  const [meditationActive, setMeditationActive] = useState(false);
  const messagesEndRef = useRef(null);
  const breathingInterval = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      addWelcomeMessage();
      loadChatHistory();
    }
  }, [user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/therapist/history');
      if (response.data && response.data.length > 0) {
        const historyMessages = response.data.map(chat => [
          { role: 'user', content: chat.userMessage, timestamp: chat.timestamp },
          { role: 'ai', content: chat.aiResponse, timestamp: chat.timestamp }
        ]).flat();
        setMessages(prev => [...prev, ...historyMessages]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessages = {
      en: "Hello! 👋 I'm MindMate AI, your mental wellness companion. I'm here to listen, support, and help you.\n\nHow are you feeling today? Remember, everything you share is confidential.",
      am: "ሰላም! 👋 እኔ MindMate AI ነኝ፣ የአእምሮ ደህንነት አጋርዎ። እዚህ ለማዳመጥ፣ ለመደገፍ እና ለማገዝ ነኝ።\n\nዛሬ እንዴት ይሰማዎታል? የሚናገሩት ሁሉ ሚስጥራዊ መሆኑን አስታውሱ።"
    };
    setMessages([{ role: 'ai', content: welcomeMessages[language], timestamp: new Date() }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.post('/therapist/chat', { 
        message: inputMessage,
        history: messages.slice(-10)
      });
      
      const aiMessage = { role: 'ai', content: response.data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      
      // Save to backend
      await api.post('/therapist/save', { 
        userMessage: inputMessage, 
        aiResponse: response.data.reply 
      });
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        en: "I'm having trouble connecting. Please try again in a moment.",
        am: "ለመገናኘት እየተቸገርኩ ነው። እባክዎ ትንሽ ቆይተው ይሞክሩ።"
      };
      setMessages(prev => [...prev, { role: 'ai', content: errorMessage[language], timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startBreathingExercise = () => {
    setShowBreathing(true);
    let step = 0;
    const steps = [
      { text: { en: "🌬️ Breathe in... 1, 2, 3, 4", am: "🌬️ ወደ ውስጥ ይተንፍሱ... 1, 2, 3, 4" } },
      { text: { en: "💨 Hold... 1, 2, 3, 4", am: "💨 ያዙ... 1, 2, 3, 4" } },
      { text: { en: "🌊 Breathe out... 1, 2, 3, 4", am: "🌊 ወደ ውጭ ይተንፍሱ... 1, 2, 3, 4" } }
    ];
    
    breathingInterval.current = setInterval(() => {
      if (step < steps.length) {
        setMessages(prev => [...prev, { role: 'ai', content: steps[step].text[language], timestamp: new Date() }]);
        step++;
      } else {
        clearInterval(breathingInterval.current);
        setShowBreathing(false);
        setMessages(prev => [...prev, { role: 'ai', content: language === 'en' ? "🙏 Great job! How do you feel now?" : "🙏 ጥሩ ስራ! አሁን እንዴት ይሰማዎታል?", timestamp: new Date() }]);
      }
    }, 4500);
  };

  const startMeditation = () => {
    setShowMeditation(true);
  };

  const beginMeditation = () => {
    setMeditationActive(true);
    setShowMeditation(false);
    
    let seconds = meditationMinutes * 60;
    const meditationInterval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(meditationInterval);
        setMeditationActive(false);
        setMessages(prev => [...prev, { role: 'ai', content: language === 'en' ? `🧘 Your ${meditationMinutes}-minute meditation is complete. How do you feel?` : `🧘 የ${meditationMinutes} ደቂቃ ማሰላሰልዎ ተጠናቋል። እንዴት ይሰማዎታል?`, timestamp: new Date() }]);
      }
    }, 1000);
    
    window.meditationInterval = meditationInterval;
  };

  const clearChat = () => {
    if (window.confirm(language === 'en' ? 'Clear all chat history?' : 'ሁሉንም የውይይት ታሪክ ይሰርዙ?')) {
      setMessages([]);
      addWelcomeMessage();
      toast.success(language === 'en' ? 'Chat cleared' : 'ውይይት ተሰርዟል');
    }
  };

  const suggestedPrompts = {
    en: [
      "😰 I'm feeling anxious",
      "💪 I need motivation", 
      "🧘 Help me relax",
      "😔 I feel sad",
      "🙏 Gratitude practice",
      "🌟 Daily affirmation",
      "📝 Journal prompt",
      "😤 I'm angry"
    ],
    am: [
      "😰 ተጨንቄአለሁ",
      "💪 ማበረታቻ ያስፈልገኛል",
      "🧘 እንድዝናና እርዳኝ",
      "😔 አዝናለሁ",
      "🙏 ምስጋና ልምምድ",
      "🌟 ዕለታዊ ማበረታቻ",
      "📝 የማስታወሻ ጥያቄ",
      "😤 ተቆጥቻለሁ"
    ]
  };

  const t = {
    en: { 
      title: 'AI Therapist', 
      subtitle: 'Your 24/7 mental wellness companion', 
      placeholder: 'Type your message...', 
      send: 'Send', 
      typing: 'AI is thinking',
      suggested: 'Quick Prompts',
      disclaimer: '⚠️ I am an AI, not a licensed therapist. If you are in crisis, please call emergency services.',
      breathing: '🧘 Breathing Exercise',
      meditation: '🧠 Guided Meditation',
      clear: 'Clear Chat'
    },
    am: { 
      title: 'AI ቴራፒስት', 
      subtitle: 'የ24/7 የአእምሮ ደህንነት አጋርዎ', 
      placeholder: 'መልእክትዎን ይተይቡ...', 
      send: 'ላክ', 
      typing: 'AI እያሰበ ነው',
      suggested: 'ፈጣን ጥያቄዎች',
      disclaimer: '⚠️ እኔ AI ነኝ፣ ፈቃድ ያለው ቴራፒስት አይደለሁም። በአደጋ ጊዜ እባክዎ የድንገተኛ ጊዜ አገልግሎት ይደውሉ።',
      breathing: '🧘 የመተንፈስ እንቅስቃሴ',
      meditation: '🧠 መመሪያ ማሰላሰል',
      clear: 'ውይይት አጥራ'
    }
  };

  const text = t[language];

  return (
    <div className="therapist-container">
      <div className="therapist-content">
        <div className="therapist-header">
          <div className="ai-avatar">🤖</div>
          <div>
            <h1>{text.title}</h1>
            <p>{text.subtitle}</p>
          </div>
          <div className="header-actions">
            <button onClick={startBreathingExercise} className="action-btn breathing-btn">{text.breathing}</button>
            <button onClick={startMeditation} className="action-btn meditation-btn">{text.meditation}</button>
            <button onClick={clearChat} className="action-btn clear-btn">{text.clear}</button>
          </div>
        </div>

        <div className="chat-container">
          <div className="messages-area">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                <div className="message-bubble">
                  {msg.role === 'ai' && <span className="ai-icon">🤖</span>}
                  <div className="message-content">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="message-time">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai-message">
                <div className="message-bubble typing-bubble">
                  <span className="ai-icon">🤖</span>
                  <div className="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                  <span className="typing-text">{text.typing}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="suggested-prompts">
            <p>{text.suggested}</p>
            <div className="prompts-grid">
              {suggestedPrompts[language].map((prompt, idx) => (
                <button key={idx} className="prompt-btn" onClick={() => setInputMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="input-area">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={text.placeholder}
              rows="2"
            />
            <button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
              {text.send} 📤
            </button>
          </div>

          <div className="disclaimer">
            <p>{text.disclaimer}</p>
            <div className="emergency-numbers">
              <span className="ethiopia">🇪🇹 Ethiopia: 8855</span>
              <span className="global">🌍 Global: 988</span>
            </div>
          </div>
        </div>
      </div>

      {showMeditation && (
        <div className="modal-overlay">
          <div className="modal-content meditation-modal">
            <h3>🧘 {language === 'en' ? 'Guided Meditation' : 'መመሪያ ማሰላሰል'}</h3>
            <p>{language === 'en' ? 'Choose duration:' : 'የቆይታ ጊዜ ይምረጡ:'}</p>
            <div className="meditation-duration">
              <button onClick={() => setMeditationMinutes(1)} className={meditationMinutes === 1 ? 'active' : ''}>1 min</button>
              <button onClick={() => setMeditationMinutes(3)} className={meditationMinutes === 3 ? 'active' : ''}>3 min</button>
              <button onClick={() => setMeditationMinutes(5)} className={meditationMinutes === 5 ? 'active' : ''}>5 min</button>
              <button onClick={() => setMeditationMinutes(10)} className={meditationMinutes === 10 ? 'active' : ''}>10 min</button>
            </div>
            <div className="modal-buttons">
              <button onClick={beginMeditation} className="start-meditation">▶️ {language === 'en' ? 'Start' : 'ጀምር'}</button>
              <button onClick={() => setShowMeditation(false)} className="cancel-meditation">❌ {language === 'en' ? 'Cancel' : 'ሰርዝ'}</button>
            </div>
          </div>
        </div>
      )}

      {meditationActive && (
        <div className="meditation-overlay">
          <div className="meditation-active">
            <div className="meditation-animation">🧘</div>
            <h2>{language === 'en' ? 'Meditating...' : 'በማሰላሰል ላይ...'}</h2>
            <p>{language === 'en' ? 'Find a comfortable position. Close your eyes. Focus on your breath.' : 'ምቹ ቦታ ይፈልጉ። ዓይኖችዎን ይዝጉ። በትንፋሽዎ ላይ ያተኩሩ።'}</p>
            <button onClick={() => {
              clearInterval(window.meditationInterval);
              setMeditationActive(false);
            }}>⏹️ {language === 'en' ? 'Stop' : 'አቁም'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Therapist;

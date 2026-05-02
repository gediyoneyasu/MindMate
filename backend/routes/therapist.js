const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Therapist = require('../models/Therapist');

// Get chat history
router.get('/history', protect, async (req, res) => {
  try {
    const chats = await Therapist.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(50);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.json([]);
  }
});

// Save chat message
router.post('/save', protect, async (req, res) => {
  try {
    const { userMessage, aiResponse } = req.body;
    const chat = new Therapist({
      userId: req.user.id,
      userMessage,
      aiResponse,
      timestamp: new Date()
    });
    await chat.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get AI response
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Simple AI response logic
    const reply = generateAIResponse(message, history);
    
    res.json({ reply });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ reply: "I'm having trouble responding right now. Please try again in a moment." });
  }
});

// Get coping strategy
router.post('/coping', protect, async (req, res) => {
  try {
    const { emotion } = req.body;
    const strategies = {
      anxious: "😰 **Coping with Anxiety:**\n\n• Take 5 deep breaths (inhale 4 sec, hold 4 sec, exhale 4 sec)\n• Name 5 things you can see, 4 you can touch, 3 you can hear\n• Drink a glass of water slowly\n• Write down what's worrying you\n• Remember: This feeling will pass",
      sad: "😔 **Coping with Sadness:**\n\n• Reach out to someone you trust\n• Do one small thing you enjoy\n• Go for a short walk outside\n• Write down 3 things you're grateful for\n• Be kind to yourself today",
      angry: "😤 **Coping with Anger:**\n\n• Step away from the situation\n• Count to 10 slowly\n• Take deep breaths\n• Punch a pillow or squeeze a stress ball\n• Write down why you're angry, then tear it up",
      motivation: "💪 **Daily Motivation:**\n\n• You've overcome every bad day so far\n• Small steps every day lead to big changes\n• Focus on progress, not perfection\n• You are stronger than you think\n• Today is a new opportunity to grow",
      gratitude: "🙏 **Gratitude Practice:**\n\n• Name 3 things that went well today\n• Think of someone who helped you recently\n• Write one thing you love about yourself\n• Appreciate something in nature you saw today\n• Thank your body for everything it does for you",
      affirmation: "🌟 **Daily Affirmations:**\n\n• I am enough just as I am\n• I deserve peace and happiness\n• I am capable of handling challenges\n• My feelings are valid\n• I am growing every single day",
      prompt: "📝 **Journal Prompt:**\n\n• What made you smile today?\n• What's one thing you're proud of this week?\n• If you could talk to your younger self, what would you say?\n• What does self-care look like for you?\n• What's a small change you'd like to make?"
    };
    
    const reply = strategies[emotion] || strategies.motivation;
    res.json({ strategy: reply });
  } catch (error) {
    console.error('Error getting coping strategy:', error);
    res.status(500).json({ strategy: "I'm having trouble right now. Please try again." });
  }
});

// Generate AI response function
function generateAIResponse(message, history = []) {
  const lowerMsg = message.toLowerCase();
  
  // Greeting responses
  if (lowerMsg.match(/hello|hi|hey|greetings|good morning|good afternoon|good evening/)) {
    return "Hello! 👋 How are you feeling today? I'm here to listen and support you. Remember, everything you share is confidential.";
  }
  
  // How are you responses
  if (lowerMsg.match(/how are you|how do you feel|are you ok|what about you/)) {
    return "I'm doing well, thank you for asking! 😊 More importantly, how are YOU feeling today? I'm here for you whatever you're going through.";
  }
  
  // Anxiety responses
  if (lowerMsg.match(/anxious|anxiety|nervous|worried|stressed|panic/)) {
    return "I hear that you're feeling anxious. That's completely normal and many people experience it. Let me help you:\n\n🧘 **Take a deep breath with me:**\n• Breathe in... 1, 2, 3, 4\n• Hold... 1, 2, 3, 4\n• Breathe out... 1, 2, 3, 4\n\nWould you like more breathing exercises or coping strategies to help with your anxiety?";
  }
  
  // Sadness responses
  if (lowerMsg.match(/sad|depressed|down|unhappy|blue|lonely|alone/)) {
    return "I'm sorry you're feeling sad. 😔 It's okay to feel this way. Remember that emotions are temporary and they will pass.\n\n💝 **What's one small thing that could bring you a little comfort right now?**\n• A warm drink? ☕\n• A favorite song? 🎵\n• A short walk? 🚶\n• Calling a friend? 📞\n\nI'm here with you. You're not alone.";
  }
  
  // Anger responses
  if (lowerMsg.match(/angry|mad|frustrated|annoyed|rage|pissed/)) {
    return "I understand you're feeling angry. 😤 That's a valid and important emotion.\n\n💨 **Take a moment to cool down:**\n1. Step away from the situation\n2. Take 5 deep breaths\n3. Count to 10 slowly\n\nWould you like to talk about what's bothering you? Sometimes expressing it helps release the anger in a healthy way.";
  }
  
  // Grateful responses
  if (lowerMsg.match(/grateful|thankful|appreciate|blessed|good day|great day/)) {
    return "That's wonderful to hear! 🙏 Practicing gratitude is one of the most powerful tools for mental health.\n\n📝 **Let's practice gratitude together:**\nName 3 things you're grateful for today. They can be small - a warm cup of tea, a kind word from someone, a beautiful sunset, or your health.\n\nShare with me and I'll celebrate with you! 🎉";
  }
  
  // Sleep responses
  if (lowerMsg.match(/sleep|tired|exhausted|can't sleep|insomnia|rest/)) {
    return "I hear you're struggling with sleep. 😴 Quality rest is essential for mental health.\n\n🌙 **Sleep Hygiene Tips:**\n• Create a calming bedtime routine\n• Put away screens 1 hour before bed 📵\n• Try a short meditation or breathing exercise 🧘\n• Avoid caffeine in the evening ☕\n• Keep your bedroom cool and dark\n\nWould you like a guided relaxation exercise to help you fall asleep?";
  }
  
  // Help/crisis responses
  if (lowerMsg.match(/help me|i need help|i can't|suicide|kill myself|end my life|hopeless|no hope|want to die|worthless/)) {
    return "⚠️ **I'm here for you right now.** What you're going through is serious and you don't have to face it alone.\n\n📞 **Please reach out to a professional right now:**\n• 🇪🇹 Ethiopia Mental Health Helpline: **8855**\n• 🌍 Global Crisis Lifeline: **988**\n• 🏥 Go to your nearest emergency room\n\n**You matter. Your life has value. Please talk to someone who can help immediately.** 💙";
  }
  
  // Default responses
  const defaultResponses = [
    "Thank you for sharing that with me. 💙 Can you tell me more about how that makes you feel? I'm here to listen without judgment.",
    "I'm listening carefully. 🤗 What would be most helpful for you right now - coping strategies, breathing exercises, or just someone to listen?",
    "That sounds challenging. 😌 Remember that you've overcome difficult moments before. You've got this. What's one small step you can take today to feel a little better?",
    "I appreciate you opening up. 💜 Would you like me to suggest some journal prompts or coping strategies that might help you process these feelings?",
    "You're not alone in this. 🌟 Many people experience similar feelings. What usually helps you feel better when you're feeling this way? Let's try that together."
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

module.exports = router;

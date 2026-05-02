import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './Home.css';

function Home() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const translations = {
    en: {
      heroTitle: 'Your Mental Health',
      heroSubtitle: 'Journey Starts Here',
      heroDesc: 'Track moods, write journals, and get AI-powered support for your mental wellbeing journey.',
      getStarted: 'Get Started',
      alreadyMember: 'Already a member?',
      loginHere: 'Login here',
      featuresTitle: 'Why Choose MindMate?',
      features: [
        { icon: 'ri-emotion-line', title: 'Mood Tracking', desc: 'Track your daily emotions with beautiful visualizations' },
        { icon: 'ri-book-open-line', title: 'Journal', desc: 'Write private reflections and track your thoughts' },
        { icon: 'ri-robot-line', title: 'AI Therapist', desc: '24/7 AI-powered emotional support and guidance' },
        { icon: 'ri-bar-chart-line', title: 'Analytics', desc: 'See your mood patterns and progress over time' }
      ],
      categoriesTitle: 'How MindMate Helps You',
      categories: [
        { name: 'Mood Tracking', emoji: '😊', desc: 'Log your daily mood with simple emoji selection' },
        { name: 'Journal', emoji: '📝', desc: 'Write down your thoughts and feelings' },
        { name: 'AI Support', emoji: '🤖', desc: 'Get personalized coping strategies' },
        { name: 'Progress', emoji: '📈', desc: 'Track your mental health journey' }
      ],
      ctaTitle: 'Start Your Mental Health Journey Today',
      ctaDesc: 'Join thousands of users who are taking care of their mental wellbeing',
      ctaBtn: 'Get Started Free',
      testimonialsTitle: 'What Our Users Say',
      footerNote: 'Your privacy matters. All data is encrypted and secure.'
    },
    am: {
      heroTitle: 'የአእምሮ ጤናህ',
      heroSubtitle: 'ጉዞ እዚህ ይጀምራል',
      heroDesc: 'ስሜትዎን ይከታተሉ፣ ማስታወሻ ይጻፉ እና ለአእምሮ ደህንነትዎ በአርቲፊሻል ኢንተሊጀንስ የሚደገፍ ድጋፍ ያግኙ።',
      getStarted: 'ይጀምሩ',
      alreadyMember: 'አባል ነዎት?',
      loginHere: 'ይግቡ',
      featuresTitle: 'ለምን MindMate ይመርጣሉ?',
      features: [
        { icon: 'ri-emotion-line', title: 'ስሜት መከታተያ', desc: 'ዕለታዊ ስሜትዎን በሚያምር ገበታዎች ይከታተሉ' },
        { icon: 'ri-book-open-line', title: 'ማስታወሻ', desc: 'የግል ሀሳቦችዎን ይጻፉ እና ይከታተሉ' },
        { icon: 'ri-robot-line', title: 'AI ቴራፒስት', desc: '24/7 በአርቲፊሻል ኢንተሊጀንስ የሚደገፍ ስሜታዊ ድጋፍ' },
        { icon: 'ri-bar-chart-line', title: 'ትንተና', desc: 'የስሜት ለውጥዎን እና እድገትዎን ይመልከቱ' }
      ],
      categoriesTitle: 'MindMate እንዴት ይረዳዎታል',
      categories: [
        { name: 'ስሜት መከታተያ', emoji: '😊', desc: 'በቀላል ኢሞጂ ዕለታዊ ስሜትዎን ይመዝግቡ' },
        { name: 'ማስታወሻ', emoji: '📝', desc: 'ሀሳቦችዎን እና ስሜቶችዎን ይጻፉ' },
        { name: 'AI ድጋፍ', emoji: '🤖', desc: 'ግላዊ የመቋቋሚያ ስልቶችን ያግኙ' },
        { name: 'እድገት', emoji: '📈', desc: 'የአእምሮ ጤና ጉዞዎን ይከታተሉ' }
      ],
      ctaTitle: 'የአእምሮ ጤና ጉዞዎን ዛሬ ይጀምሩ',
      ctaDesc: 'አእምሮ ጤናቸውን ከሚንከባከቡ በሺዎች የሚቆጠሩ ተጠቃሚዎች ጋር ይቀላቀሉ',
      ctaBtn: 'በነጻ ይጀምሩ',
      testimonialsTitle: 'ተጠቃሚዎቻችን ምን ይላሉ',
      footerNote: 'ግላዊነትዎ አስፈላጊ ነው። ሁሉም ውሂብዎ የተመሰጠረ እና ደህንነቱ የተጠበቀ ነው።'
    }
  };

  const t = translations[language];

  const sliders = [
    { image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200', title: 'Your Mental Health', subtitle: 'Journey Starts Here', desc: 'Start your journey to better mental health today' },
    { image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200', title: 'Track Your Mood', subtitle: 'Every Day', desc: 'Understand your emotions better' },
    { image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1200', title: 'AI Therapist', subtitle: '24/7 Support', desc: 'Always here for you' }
  ];

  const testimonials = [
    { name: 'Sarah J.', role: 'User', comment: 'MindMate helped me understand my emotions better. The AI therapist is amazing!', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Michael T.', role: 'User', comment: 'Daily journaling has become a habit. The mood tracker shows my progress clearly.', rating: 5, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Emily R.', role: 'User', comment: 'Finally found a mental health app that actually helps. Highly recommend!', rating: 4, image: 'https://randomuser.me/api/portraits/women/2.jpg' }
  ];

  const features = t.features;

  const categories = t.categories;

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <div className="hero-slider">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          autoplay={{ delay: 4000 }}
          loop={true}
          effect="fade"
          pagination={{ clickable: true }}
          // navigation removed
          className="hero-swiper"
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={index} className="hero-slide">
              <div className="slide-bg" style={{ backgroundImage: `url(${slider.image})` }}></div>
              <div className="hero-content">
                <h1>{t.heroTitle} <span>{t.heroSubtitle}</span></h1>
                <p>{t.heroDesc}</p>
                <div className="hero-buttons">
                  <Link to={isLoggedIn ? "/dashboard" : "/auth"} className="btn-primary">
                    {t.getStarted}
                  </Link>
                  {!isLoggedIn && (
                    <Link to="/auth" className="btn-secondary">
                      {t.loginHere}
                    </Link>
                  )}
                </div>
                {!isLoggedIn && (
                  <div className="hero-note">
                    <small>{t.alreadyMember} <Link to="/auth">{t.loginHere}</Link></small>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">{t.featuresTitle}</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - How MindMate Helps */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">{t.categoriesTitle}</h2>
          <div className="categories-grid">
            {categories.map((category, idx) => (
              <div className="category-item" key={idx}>
                <div className="category-card">
                  <div className="category-icon">
                    <span className="category-emoji">{category.emoji}</span>
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t.testimonialsTitle}</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={i < testimonial.rating ? 'ri-star-fill' : 'ri-star-line'}></i>
                  ))}
                </div>
                <p>"{testimonial.comment}"</p>
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaDesc}</p>
            <Link to={isLoggedIn ? "/dashboard" : "/auth"} className="cta-btn">
              {t.ctaBtn} <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="footer-note">
        <div className="container">
          <p><i className="ri-lock-line"></i> {t.footerNote}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

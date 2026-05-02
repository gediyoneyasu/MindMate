import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const translations = {
    en: {
      tagline: 'Your companion for mental wellness journey',
      quickLinks: 'Quick Links',
      resources: 'Resources',
      legal: 'Legal',
      contact: 'Contact',
      home: 'Home',
      dashboard: 'Dashboard',
      journal: 'Journal',
      mood: 'Mood Tracker',
      therapist: 'AI Therapist',
      analytics: 'Analytics',
      about: 'About Us',
      blog: 'Blog',
      help: 'Help Center',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      emailValue: 'support@mindmate.com',
      phoneValue: '+251 911 234 567',
      addressValue: 'Addis Ababa, Ethiopia',
      newsletter: 'Newsletter',
      newsletterText: 'Subscribe to get mental wellness tips',
      subscribe: 'Subscribe',
      copyright: 'All rights reserved.',
      madeWith: 'Made with',
      forWellness: 'for mental wellness'
    },
    am: {
      tagline: 'የአእምሮ ደህንነት ጉዞዎ አጃቢ',
      quickLinks: 'ፈጣን አገናኞች',
      resources: 'መረጃዎች',
      legal: 'ህጋዊ',
      contact: 'አግኙን',
      home: 'መነሻ',
      dashboard: 'ዳሽቦርድ',
      journal: 'ማስታወሻ',
      mood: 'ስሜት መከታተያ',
      therapist: 'AI ቴራፒስት',
      analytics: 'ትንተና',
      about: 'ስለ እኛ',
      blog: 'ብሎግ',
      help: 'እርዳታ',
      privacy: 'የግላዊነት ፖሊሲ',
      terms: 'አገልግሎት ውሎች',
      cookies: 'ኩኪ ፖሊሲ',
      email: 'ኢሜይል',
      phone: 'ስልክ',
      address: 'አድራሻ',
      emailValue: 'support@mindmate.com',
      phoneValue: '+251 911 234 567',
      addressValue: 'አዲስ አበባ, ኢትዮጵያ',
      newsletter: 'ጋዜጣ',
      newsletterText: 'ለአእምሮ ደህንነት ምክሮች ይመዝገቡ',
      subscribe: 'ይመዝገቡ',
      copyright: 'መብቱ በህግ የተጠበቀ ነው።',
      madeWith: 'የተሰራው በ',
      forWellness: 'ለአእምሮ ደህንነት'
    }
  };

  const t = translations[language];

  const quickLinks = [
    { name: t.home, path: '/' },
    { name: t.dashboard, path: '/dashboard' },
    { name: t.journal, path: '/journal' },
    { name: t.mood, path: '/mood' },
    { name: t.therapist, path: '/therapist' },
    { name: t.analytics, path: '/analytics' }
  ];

  const resources = [
    { name: t.about, path: '/about' },
    { name: t.blog, path: '/blog' },
    { name: t.help, path: '/help' }
  ];

  const legal = [
    { name: t.privacy, path: '/privacy' },
    { name: t.terms, path: '/terms' },
    { name: t.cookies, path: '/cookies' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-column">
          <div className="footer-logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">MindMate</span>
          </div>
          <p className="footer-tagline">{t.tagline}</p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <i className="ri-twitter-x-line"></i>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <i className="ri-linkedin-fill"></i>
            </a>
            <a href="#" className="social-link" aria-label="Telegram">
              <i className="ri-telegram-fill"></i>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-column">
          <h3 className="footer-title">{t.quickLinks}</h3>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div className="footer-column">
          <h3 className="footer-title">{t.resources}</h3>
          <ul className="footer-links">
            {resources.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-column">
          <h3 className="footer-title">{t.legal}</h3>
          <ul className="footer-links">
            {legal.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Newsletter Column */}
        <div className="footer-column">
          <h3 className="footer-title">{t.contact}</h3>
          <ul className="footer-contact">
            <li>
              <i className="ri-mail-line"></i>
              <span>{t.emailValue}</span>
            </li>
            <li>
              <i className="ri-phone-line"></i>
              <span>{t.phoneValue}</span>
            </li>
            <li>
              <i className="ri-map-pin-line"></i>
              <span>{t.addressValue}</span>
            </li>
          </ul>

          <div className="newsletter">
            <h4>{t.newsletter}</h4>
            <p>{t.newsletterText}</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={language === 'en' ? 'Your email' : 'ኢሜይልዎ'} />
              <button type="submit">{t.subscribe}</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            &copy; {currentYear} MindMate. {t.copyright}
          </p>
          <p className="made-with">
            {t.madeWith} <i className="ri-heart-fill heart-icon"></i> {t.forWellness}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

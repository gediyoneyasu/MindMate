import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';
import './Header.css';

function Header() {
  const { language, changeLanguage } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(userData.name || '');
      } catch {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
    closeMenu();
  };

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setShowLangDropdown(false);
  };

  const toggleLangDropdown = () => setShowLangDropdown(!showLangDropdown);

  const translations = {
    en: {
      home: 'Home',
      dashboard: 'Dashboard',
      journal: 'Journal',
      mood: 'Mood Tracker',
      therapist: 'AI Therapist',
      analytics: 'Analytics',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login'
    },
    am: {
      home: 'መነሻ',
      dashboard: 'ዳሽቦርድ',
      journal: 'ማስታወሻ',
      mood: 'ስሜት መከታተያ',
      therapist: 'AI ቴራፒስት',
      analytics: 'ትንተና',
      profile: 'መገለጫ',
      logout: 'ውጣ',
      login: 'ግባ'
    }
  };

  const t = translations[language];

  // Function to handle protected link clicks
  const handleProtectedClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  return (
    <header className="nav_wrapper">
      <div className="nav_logo">
        <Link to="/"><span>MindMate</span></Link>
      </div>

      <ul className={showMenu ? "showNav" : ""} onClick={closeMenu}>
        <li><Link to="/">{t.home}</Link></li>
        {/* Show ALL menus for everyone - but protect the links */}
        <li>
          <Link 
            to="/dashboard" 
            onClick={(e) => handleProtectedClick(e, '/dashboard')}
            className={!isLoggedIn ? 'protected-link' : ''}
          >
            {t.dashboard}
          </Link>
        </li>
        <li>
          <Link 
            to="/journal" 
            onClick={(e) => handleProtectedClick(e, '/journal')}
            className={!isLoggedIn ? 'protected-link' : ''}
          >
            {t.journal}
          </Link>
        </li>
        <li>
          <Link 
            to="/mood" 
            onClick={(e) => handleProtectedClick(e, '/mood')}
            className={!isLoggedIn ? 'protected-link' : ''}
          >
            {t.mood}
          </Link>
        </li>
        <li>
          <Link 
            to="/therapist" 
            onClick={(e) => handleProtectedClick(e, '/therapist')}
            className={!isLoggedIn ? 'protected-link' : ''}
          >
            {t.therapist}
          </Link>
        </li>
        <li>
          <Link 
            to="/analytics" 
            onClick={(e) => handleProtectedClick(e, '/analytics')}
            className={!isLoggedIn ? 'protected-link' : ''}
          >
            {t.analytics}
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            onClick={(e) => handleProtectedClick(e, '/profile')}
            className={!isLoggedIn ? 'protected-link' : ''}
          >
            {t.profile}
          </Link>
        </li>
        {isLoggedIn && <li><button onClick={handleLogout} className="mobile-logout">{t.logout}</button></li>}
      </ul>

      <div className="nav_btn">
        <div className="language-dropdown">
          <button className="lang-btn" onClick={toggleLangDropdown}>
            <span>{language === 'en' ? 'EN' : 'አማ'}</span>
            <i className="ri-arrow-down-s-line"></i>
          </button>
          {showLangDropdown && (
            <div className="lang-dropdown-menu">
              <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => selectLanguage('en')}>English (EN)</button>
              <button className={`lang-option ${language === 'am' ? 'active' : ''}`} onClick={() => selectLanguage('am')}>አማርኛ (AM)</button>
            </div>
          )}
        </div>
        
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-profile-icon"><i className="ri-user-line"></i></Link>
            <div className="user-menu">
              <Link to="/profile" className="user-btn"><i className="ri-user-line"></i><span>{userName.split(' ')[0]}</span></Link>
              <button type="button" onClick={handleLogout} className="logout-icon"><i className="ri-logout-box-line"></i></button>
            </div>
          </>
        ) : (
          <Link to="/auth" className="auth-btn"><i className="ri-user-line"></i><span>{t.login}</span></Link>
        )}
        
        <i className="ri-menu-4-line" id="bars" onClick={toggleMenu}></i>
      </div>
    </header>
  );
}

export default Header;

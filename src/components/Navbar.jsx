import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';
// 🔹 นำเข้าไฟล์ CSS ที่เราสร้าง

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };


  return (
    <div className="navbar">

      <div className="nav-container1">
        <img src='./image/logo.svg' alt='Breathe-Away Logo' className='nav-logo' />
        <div className='text-logo'>
          Breathe-Away
        </div>
      </div>


      <div className="nav-container2">
        <div className='menuBar'>
          <div className='list'><Link to="/">{t('nav.home')}</Link></div>
          <div className='list'><Link to="/recommend">{t('nav.recommend')}</Link></div>
          <div className='list'><Link to="/campStay">{t('nav.campStay')}</Link></div>
          <div className='list'><Link to="/contact">{t('nav.contact')}</Link></div>
        </div>
      </div>

      {/* Hamburger icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <img src='./image/hamburger.svg' alt='Menu' className='hamburger-icon' />
      </div>
      <div className={`menu ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
        <Link to="/recommend" onClick={() => setMenuOpen(false)}>{t('nav.recommend')}</Link>
        <Link to="/campStay" onClick={() => setMenuOpen(false)}>{t('nav.campStay')}</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>
      </div>

      <div className='nav-logo-mobile'>
        <img src='./image/logo.svg' alt='Breathe-Away Logo' className='logo-mobile' />
        <div className='text-logo-mobile'>
          Breathe-Away
        </div>

      </div>

      <div className="nav-container3">

        <div className='language'>
          <img src='./image/language.svg' alt='Language' className='language-icon' />

          <label htmlFor="language-select" className="visually-hidden">Select Language</label>
          <select
            id="language-select"
            className="language-dropdown"
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="en">EN</option>
            <option value="th">TH</option>
          </select>
        </div>

        <div className='botton-login'>
          <Link to="login">{t('auth.login')}</Link>
        </div>

        <img src="./image/person.svg" alt="login-mobile" className='botton-login-mobile' />

      </div>
    </div>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';
import LoginButton from './LoginButton';
import { useAuth, } from '../contexts/AuthContext';
import { Avatar, Dropdown, Skeleton } from 'antd';
import { LogoutOutlined, UserOutlined, TeamOutlined, FileTextOutlined, EnvironmentOutlined, AppstoreOutlined } from '@ant-design/icons';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Get first letter of user's name or email
  const getFirstLetter = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Default fallback
  };

  // Create different menu items based on user role
  const getAvatarMenuItems = () => {
    const baseItems = [
      {
        key: 'profile',
        label: (
          <div style={{ padding: '8px 12px', height: '2rem' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
              {user?.username || user?.email}
            </div>
        
            {/* <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              Role: {user?.role?.role_name.toLowerCase() || 'user'}
            </div> */}
          </div>
        ),
      },
      {
        type: 'divider',
      },
    ];

    // Admin specific menu items
    const adminItems = [
      {
        key: 'user-manage',
        label: (
          <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TeamOutlined />
            {t('user.userManage') || 'User Manage'}
          </Link>
        ),
      },
      {
        key: 'post-manage',
        label: (
          <Link to="/admin/posts" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined />
            {t('user.postManage') || 'Post Manage'}
          </Link>
        ),
      },
      {
        key: 'place-manage',
        label: (
          <Link to="/admin/places" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EnvironmentOutlined />
            {t('user.placeManage') || 'Place Manage'}
          </Link>
        ),
      },
      {
        key: 'type-manage',
        label: (
          <Link to="/admin/types" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AppstoreOutlined />
            {t('user.typeManage') || 'Type Manage'}
          </Link>
        ),
      },
      {
        type: 'divider',
      },
    ];

    // User specific menu items
    const userItems = [
      {
        key: 'my-account',
        label: (
          <Link to="/account" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserOutlined />
            {t('user.myAccount') || 'My Account'}
          </Link>
        ),
      },
      {
        key: 'my-posts',
        label: (
          <Link to="/my-posts" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined />
            {t('user.post') || 'Post'}
          </Link>
        ),
      },
    ];

    // Logout item (common for both roles)
    const logoutItem = [
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: (
          <span onClick={logout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogoutOutlined />
            {t('user.logOut') || 'Logout'}
          </span>
        ),
      },
    ];

    // Combine items based on role
    if (user?.role.role_name.toLowerCase() === 'admin') {
      return [...baseItems, ...adminItems, ...logoutItem];
    } else {
      return [...baseItems, ...userItems, ...logoutItem];
    }
  };

  if (loading) return <Skeleton />

  return (
    <div className="navbar">
      <div className="nav-container1">
        <img src='/image/logo192.png' alt='Breathe-Away Logo' className='nav-logo' />
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
          <img src='/image/language.svg' alt='Language' className='language-icon' />

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

        {isAuthenticated ? (
          <div className='profile' style={{ paddingRight: '1.5rem' }}>
            <Dropdown
              menu={{ items: getAvatarMenuItems() }}
              trigger={['click']}
              placement="bottomRight"
              overlayStyle={{ minWidth: '180px' }}
            >
              <Avatar
                style={{
                  backgroundColor: user?.role === 'admin' ? '#ff4757' : 'var(--color-primary)',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: user?.role === 'admin' ? '2px solid #ff6b7d' : 'none',
                }}
              >
                {getFirstLetter()}
              </Avatar>
            </Dropdown>
          </div>
        ) : (
          <div className='login'>
            <LoginButton />
          </div>
        )}

        <img src="./image/person.svg" alt="login-mobile" className='botton-login-mobile' />
      </div>
    </div>
  );
};

export default Navbar;

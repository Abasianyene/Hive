import React, { useState, useRef, useEffect } from 'react';
import '../index.css';
import logo from '../assets/images/bee-hive.png'
import { Search, Images, Tag, Smile, MapPin, Home, MonitorPlay, Store, UsersRound, Gamepad2, AlignJustify, MessageCircleMore, Bell, CircleUserRound, SquarePen, BookOpen, Clapperboard, Film, CalendarPlus, Megaphone, MailCheck, Globe2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import profile from '../assets/images/profile.png';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Prevent background scroll when post popup is open
  useEffect(() => {
    if (showPostPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showPostPopup]);

  return (
    <>
      {/* Blur overlay when post popup is open */}
      {showPostPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
        />
      )}

      {/* Main header content */}
      <header className={`header${showPostPopup ? ' blurred' : ''}`}>
        <div className='header-logo'>
          <img src={logo} alt="logo"/>
        </div>
        <div className="header-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input type="text" placeholder="Search Hive" />
          </div>
        </div>
        <nav className="header-nav-center">
          <Link
            to="/"
            className={`header-icon-wrapper${currentPath === '/' ? ' selected' : ''}`}
            data-tooltip="Home"
          >
            <Home className={`header-icon${currentPath === '/' ? ' selected' : ''}`} />
          </Link>
          <Link
            to="/videos"
            className={`header-icon-wrapper${currentPath === '/videos' ? ' selected' : ''}`}
            data-tooltip="Videos"
          >
            <MonitorPlay className={`header-icon${currentPath === '/videos' ? ' selected' : ''}`} />
          </Link>
          <Link
            to="/market"
            className={`header-icon-wrapper${currentPath === '/market' ? ' selected' : ''}`}
            data-tooltip="Buzz-Market"
          >
            <Store className={`header-icon${currentPath === '/market' ? ' selected' : ''}`} />
          </Link>
          <Link
            to="/hives"
            className={`header-icon-wrapper${currentPath === '/hives' ? ' selected' : ''}`}
            data-tooltip="Hives"
          >
            <UsersRound className={`header-icon${currentPath === '/hives' ? ' selected' : ''}`} />
          </Link>
          <Link
            to="/games"
            className={`header-icon-wrapper${currentPath === '/games' ? ' selected' : ''}`}
            data-tooltip="Games"
          >
            <Gamepad2 className={`header-icon${currentPath === '/games' ? ' selected' : ''}`} />
          </Link>
        </nav>
        <nav className="header-nav-right">
          <span
            className="header-icon1-wrapper"
            data-tooltip="Menu"
            onClick={() => setMenuOpen((open) => !open)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <AlignJustify className="header-icon1" />
            {menuOpen && (
              <div
                ref={menuRef}
                style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '10px',
                  padding: '12px 0',
                  zIndex: 300,
                  minWidth: '250px'
                }}
              >
                <div 
                  className='popup-menu-item'
                  onClick={() => {
                    setShowPostPopup(true);
                    setMenuOpen(false);
                  }}
                ><SquarePen /> Post</div>
                <div className='popup-menu-item'><BookOpen /> Story</div>
                <div className='popup-menu-item'><Film /> Reels</div>
                <div className='popup-menu-item'><Clapperboard /> Go Live</div>
                <div className='popup-menu-item'><CalendarPlus /> Create Event</div>
                <div className='popup-menu-item'><Megaphone /> Ad</div>
                <div className='popup-menu-item'><MailCheck /> Subscription</div>
              </div>
            )}
          </span>
          <Link
            to="/messages"
            className="header-icon1-wrapper"
            data-tooltip="Messages"
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <MessageCircleMore className="header-icon1" />
          </Link>
          <span className="header-icon1-wrapper" data-tooltip="Notification"><Bell className="header-icon1" /></span>
          <span className="header-icon1-wrapper" data-tooltip="Profile"><CircleUserRound className="header-icon1" /></span>
        </nav>
      </header>

      {/* Centered Post Popup */}
      {showPostPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 300,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
              padding: 0,
              minWidth: '450px',
              maxWidth: '95vw',
              minHeight: '340px',
              width: '50%',
              zIndex: 301,
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}
          >
            {/* Header */}
            <div style={{
              borderBottom: '1px solid #eee',
              padding: '18px 24px 12px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ fontWeight: 700, fontSize: 22 }}>Create Post</span>
              <button
                onClick={() => setShowPostPopup(false)}
                style={{
                  position: 'absolute',
                  right: 18,
                  top: 14,
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#555'
                }}
                aria-label="Close"
              >×</button>
            </div>
            {/* User Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 24px 0 24px'
            }}>
              <img src={profile} alt="profile" style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                marginRight: 12,
                objectFit: 'cover'
              }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>User</div>
                <div style={{
                  fontSize: 13,
                  color: '#555',
                  background: '#f0f2f5',
                  borderRadius: 6,
                  padding: '2px 8px',
                  display: 'inline-block',
                  marginTop: 2
                }}>
                  <Globe2 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Public
                </div>
              </div>
            </div>
            {/* Textarea */}
            <div style={{ padding: '12px 24px 0 24px', flex: 1 }}>
              <textarea
                style={{
                  width: '100%',
                  minHeight: '90px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '20px',
                  resize: 'vertical',
                  background: 'transparent',
                  marginTop: 8
                }}
                placeholder="What's on your mind, Your Name?"
              />
            </div>
            {/* Add to your post */}
            <div style={{
              padding: '0 24px 18px 24px',
              marginTop: 12
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f0f2f5',
                borderRadius: 8,
                padding: '10px 14px'
              }}>
                <span style={{ fontWeight: 600, color: '#555' }}>Add to your post</span>
                <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
                  <span className="add-post-icon-wrapper" data-tooltip="Photo/Video">
                    <Images color="#45bd62" style={{ cursor: 'pointer' }} />
                  </span>
                  <span className="add-post-icon-wrapper" data-tooltip="Tag People">
                    <Tag color="#1877f2" style={{ cursor: 'pointer' }} />
                  </span>
                  <span className="add-post-icon-wrapper" data-tooltip="Feeling/Activity">
                    <Smile color="#f7b928" style={{ cursor: 'pointer' }} />
                  </span>
                  <span className="add-post-icon-wrapper" data-tooltip="Check in">
                    <MapPin color="#f5533d" style={{ cursor: 'pointer' }} />
                  </span>
                  {/* Add more icons as needed */}
                </div>
              </div>
              <button
                style={{
                  width: '100%',
                  background: '#FFD700',
                  color: '#222',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 0',
                  fontWeight: 700,
                  fontSize: 17,
                  cursor: 'pointer',
                  marginTop: 18,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
                onClick={() => setShowPostPopup(false)}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
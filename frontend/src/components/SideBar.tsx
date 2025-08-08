import '../index.css';
import profile from '../assets/images/profile.png';
import beehive from '../assets/images/bee-hive (1).png'; 
import birthday from '../assets/images/birthday-cake.png';
import video from '../assets/images/clapperboard.png';
import page from '../assets/images/document.png';
import friends from '../assets/images/people.png';
import pilot from '../assets/images/pilot.png';
import saved from '../assets/images/download.png';
import market from '../assets/images/market.png';
import payment from '../assets/images/dollar.png';
import funds from '../assets/images/funds.png';
import ads from '../assets/images/megaphone.png';
import event from '../assets/images/black-ribbon.png';
import memory from '../assets/images/card-games.png';
import settings from '../assets/images/settings.png';
import help from '../assets/images/question.png';
import game from '../assets/images/joystick.png';
import { Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { to: '/profile', icon: profile, label: 'My Profile' },
  { to: '/friends', icon: friends, label: 'Friends' },
  { to: '/hives', icon: beehive, label: 'Hives' },
  { to: '/copilot', icon: pilot, label: 'Hive Copilot' },
  { to: '/saved', icon: saved, label: 'Saved' },
  { to: '/pages', icon: page, label: 'Pages' },
  { to: '/market', icon: market, label: 'Buzz-Market' },
  { to: '/ordersAndPayments', icon: payment, label: 'Orders & Payments' },
  { to: '/fundraisers', icon: funds, label: 'Fund Raisers' },
  { to: '/ads', icon: ads, label: 'Ad Center' },
  { to: '/birthdays', icon: birthday, label: 'Birthdays' },
  { to: '/events', icon: event, label: 'Events' },
  { to: '/memories', icon: memory, label: 'Memories' },
  { to: '/games', icon: game, label: 'Games' },
  { to: '/videos', icon: video, label: 'Videos' },
  { to: '/settings', icon: settings, label: 'Settings' },
  { to: '/help', icon: help, label: 'Help' },
];

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside style={{
      width: '350px',
      background: '#F0F2F5',
      padding: '24px 12px',
      minHeight: '100vh',
      height: '100vh',
      overflowY: 'auto', // Enable scrolling only for the sidebar
      position: 'sticky',
      top: 0
    }}>
      <nav className='sidebar-nav'>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sidebarLinks.map(link => (
            <li
              key={link.to}
              style={{
                margin: '25px 10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Link
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: currentPath === link.to ? '#FFD700' : 'inherit'
                }}
              >
                <img src={link.icon} alt={link.label} style={{ width: 40, height: 40, marginRight: 10 }} />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar
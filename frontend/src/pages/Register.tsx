import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/bee-hive.png'; // Adjust path if needed
import '../index.css';

const recentLogins = [
  {
    username: 'janedoe',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'janedoe@email.com'
  },
  {
    username: 'johnsmith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'johnsmith@email.com'
  }
  // Add more as needed
];

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleQuickLogin = (email) => {
    setForm(f => ({ ...f, email }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Left Side: Logo and Recent Logins */}
      <div style={{
        flex: 1,
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginRight: 48
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <img src={logo} alt="Hive Logo" style={{ width: 60, height: 60, marginRight: 18 }} />
          <span style={{ fontWeight: 800, fontSize: 38, color: '#FFD700', letterSpacing: 1 }}>Hive</span>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 12px #0001',
          padding: '40px 25px 40px 25px',
          width: '100%',
          maxWidth: 340,
          minHeight: 250 // <-- Increased height
        }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: '#222' }}>
            Recent logins
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {recentLogins.map(user => (
              <div
                key={user.email}
                onClick={() => handleQuickLogin(user.email)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: 80
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #FFD700',
                    marginBottom: 6
                  }}
                />
                <span style={{
                  fontSize: 15,
                  color: '#222',
                  fontWeight: 500,
                  textAlign: 'center',
                  wordBreak: 'break-word'
                }}>{user.username}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 10 }}>
            Click your account to log in faster.
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '40px 36px 32px 36px',
          borderRadius: 16,
          boxShadow: '0 2px 16px #0001',
          minWidth: 350,
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        <h2 style={{
          textAlign: 'center',
          marginBottom: 10,
          fontWeight: 700,
          fontSize: 28,
          color: '#222'
        }}>Create a new account</h2>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #eee',
            background: '#f0f2f5',
            fontSize: 16
          }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #eee',
            background: '#f0f2f5',
            fontSize: 16
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #eee',
            background: '#f0f2f5',
            fontSize: 16
          }}
        />
        <button
          type="submit"
          style={{
            background: '#FFD700',
            color: '#222',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            marginTop: 8,
            boxShadow: '0 1px 2px #0001'
          }}
        >
          Register
        </button>
        <div style={{ textAlign: 'center', color: msg.includes('success') ? '#45bd62' : '#f5533d', fontWeight: 500 }}>
          {msg}
        </div>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1877f2', textDecoration: 'none', fontWeight: 600 }}>
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
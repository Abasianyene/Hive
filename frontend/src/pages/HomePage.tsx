import React, { useState } from 'react';
import '../index.css';

const mockPosts = [
  {
    id: 1,
    user: {
      name: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    time: '2 hrs ago',
    content: "Had a great day at the park! 🌳🌞",
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    likes: 12,
    comments: [
      { user: 'John Smith', text: 'Looks fun!' }
    ]
  },
  {
    id: 2,
    user: {
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    time: '5 hrs ago',
    content: "Just finished a 10k run! 🏃‍♂️💨",
    image: '',
    likes: 8,
    comments: []
  }
];

const HomePage = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosts([
      {
        id: Date.now(),
        user: {
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
        },
        time: 'Just now',
        content: newPost,
        image: '',
        likes: 0,
        comments: []
      },
      ...posts
    ]);
    setNewPost('');
  };

  return (
    <div style={{
      background: '#fff', // Changed from #f0f2f5 to white
      minHeight: '100vh',
      // width: '100vw',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 0',
        minHeight: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 540,
          margin: '0 16px'
        }}>

          {/* Posts Feed */}
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px #0001',
                marginBottom: 24,
                padding: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{post.user.name}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{post.time}</div>
                </div>
              </div>
              <div style={{ fontSize: 16, marginBottom: post.image ? 12 : 0 }}>{post.content}</div>
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    margin: '10px 0',
                    maxHeight: 340,
                    objectFit: 'cover'
                  }}
                />
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                marginTop: 10,
                color: '#888',
                fontSize: 15
              }}>
                <span>👍 {post.likes} Likes</span>
                <span>💬 {post.comments.length} Comments</span>
              </div>
              {/* Comments */}
              {post.comments.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {post.comments.map((c, i) => (
                    <div key={i} style={{ color: '#444', fontSize: 15, marginBottom: 4 }}>
                      <b>{c.user}:</b> {c.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
import { io } from 'socket.io-client';
import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import { Search, Phone, Video, Info, MoreVertical, Smile, Send, Paperclip, CircleDot, X, MicOff, Mic, Volume2, VolumeX } from 'lucide-react';

// Mock data for demonstration
const conversations = [
  {
    id: 1,
    name: 'Jane Doe',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'See you soon!',
    time: '2m',
    unread: 2,
    online: true,
    messages: [
      { from: 'them', text: 'Hey! How are you?' },
      { from: 'me', text: 'I\'m good, you?' },
      { from: 'them', text: 'See you soon!' }
    ]
  },
  {
    id: 2,
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Let\'s catch up tomorrow.',
    time: '10m',
    unread: 0,
    online: false,
    messages: [
      { from: 'me', text: 'Let\'s catch up tomorrow.' }
    ]
  },
  // Add more mock conversations as needed
];

const emojiList = ['😀', '😂', '😍', '😎', '👍', '🎉', '❤️', '😢', '😡', '🙏'];

const Messages: React.FC = () => {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [convData, setConvData] = useState(conversations);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const socket = useRef(io('http://localhost:5002')).current;
  const [yourId, setYourId] = useState('');
  const [otherId, setOtherId] = useState('');
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localAudio = useRef<HTMLAudioElement>(null);
  const remoteAudio = useRef<HTMLAudioElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // Video call state
  const [callActive, setCallActive] = useState(false);
  const [localMuted, setLocalMuted] = useState(false);

  // Add this state for audio call
  const [audioCallActive, setAudioCallActive] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // On mount, get your socket id
  useEffect(() => {
    socket.emit('join');
    socket.on('your-id', id => setYourId(id));
  }, [socket]);

  // Call button handler
  const startCall = async () => {
    setCallActive(true);
    peerConnection.current = new RTCPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideo.current) localVideo.current.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.current!.addTrack(track, stream));

    peerConnection.current.onicecandidate = e => {
      if (e.candidate) {
        socket.emit('ice-candidate', { to: otherId, candidate: e.candidate });
      }
    };

    peerConnection.current.ontrack = e => {
      if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('call-user', { to: otherId, offer });
  };

  // End call handler
  const endCall = () => {
    setCallActive(false);
    setLocalMuted(false);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localVideo.current && localVideo.current.srcObject) {
      (localVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop());
      localVideo.current.srcObject = null;
    }
    if (remoteVideo.current && remoteVideo.current.srcObject) {
      (remoteVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop());
      remoteVideo.current.srcObject = null;
    }
  };

  // Mute/unmute local audio
  const toggleMute = () => {
    setLocalMuted(m => {
      if (localVideo.current && localVideo.current.srcObject) {
        (localVideo.current.srcObject as MediaStream)
          .getAudioTracks()
          .forEach(track => (track.enabled = m));
      }
      return !m;
    });
  };

  // Audio call button handler
  const startAudioCall = async () => {
    setAudioCallActive(true);
    peerConnection.current = new RTCPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    if (localAudio.current) localAudio.current.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.current!.addTrack(track, stream));

    peerConnection.current.onicecandidate = e => {
      if (e.candidate) {
        socket.emit('ice-candidate', { to: otherId, candidate: e.candidate });
      }
    };

    peerConnection.current.ontrack = e => {
      if (remoteAudio.current) remoteAudio.current.srcObject = e.streams[0];
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('call-user', { to: otherId, offer });
  };

  const endAudioCall = () => {
    setAudioCallActive(false);
    setAudioMuted(false);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localAudio.current && localAudio.current.srcObject) {
      (localAudio.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop());
      localAudio.current.srcObject = null;
    }
    if (remoteAudio.current && remoteAudio.current.srcObject) {
      (remoteAudio.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop());
      remoteAudio.current.srcObject = null;
    }
  };

  const toggleAudioMute = () => {
    setAudioMuted(m => {
      if (localAudio.current && localAudio.current.srcObject) {
        (localAudio.current.srcObject as MediaStream)
          .getAudioTracks()
          .forEach(track => (track.enabled = m));
      }
      return !m;
    });
  };

  // Listen for call and answer
  useEffect(() => {
    socket.on('call-made', async data => {
      if (audioCallActive) {
        peerConnection.current = new RTCPeerConnection();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (localAudio.current) localAudio.current.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.current!.addTrack(track, stream));

        peerConnection.current.onicecandidate = e => {
          if (e.candidate) {
            socket.emit('ice-candidate', { to: data.from, candidate: e.candidate });
          }
        };

        peerConnection.current.ontrack = e => {
          if (remoteAudio.current) remoteAudio.current.srcObject = e.streams[0];
        };

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('make-answer', { to: data.from, answer });
        setOtherId(data.from);
      } else {
        setCallActive(true);
        peerConnection.current = new RTCPeerConnection();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideo.current) localVideo.current.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.current!.addTrack(track, stream));

        peerConnection.current.onicecandidate = e => {
          if (e.candidate) {
            socket.emit('ice-candidate', { to: otherId, candidate: e.candidate });
          }
        };

        peerConnection.current.ontrack = e => {
          if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
        };

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit('call-user', { to: otherId, offer });
      }
    });

    socket.on('answer-made', async data => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('ice-candidate', async data => {
      try {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {}
    });

    // Clean up on unmount
    return () => {
      socket.off('call-made');
      socket.off('answer-made');
      socket.off('ice-candidate');
    };
  }, [socket, audioCallActive]);

  // Simulate typing indicator for demo
  useEffect(() => {
    if (typing) {
      const timeout = setTimeout(() => setTyping(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [typing]);

  const selectedConversation = convData.find(c => c.id === selectedId);

  // Responsive: adjust layout for mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sending a message
  const sendMessage = () => {
    if (!input.trim()) return;
    setConvData(prev =>
      prev.map(conv =>
        conv.id === selectedId
          ? {
              ...conv,
              messages: [...conv.messages, { from: 'me', text: input }],
              lastMessage: input,
              time: 'now',
              unread: 0
            }
          : conv
      )
    );
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setConvData(prev =>
        prev.map(conv =>
          conv.id === selectedId
            ? {
                ...conv,
                messages: [...conv.messages, { from: 'them', text: 'This is an automated reply.' }],
                lastMessage: 'This is an automated reply.',
                time: 'now'
              }
            : conv
        )
      );
    }, 1200);
  };

  // On chat open
  useEffect(() => {
    fetch(`/api/messages/${yourId}/${otherId}`)
      .then(res => res.json())
      .then(setConvData);
  }, [yourId, otherId]);

  return (
    <div style={{
      display: 'flex',
      height: isMobile ? '100vh' : 'calc(100vh - 70px)',
      background: '#f0f2f5',
      borderRadius: 12,
      margin: isMobile ? 0 : '24px auto',
      maxWidth: 1200,
      boxShadow: isMobile ? undefined : '0 2px 12px #0001',
      overflow: 'hidden',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      {/* Sidebar */}
      {!isMobile || (isMobile && !selectedConversation) ? (
        <aside style={{
          width: isMobile ? '100%' : 340,
          background: '#fff',
          borderRight: isMobile ? undefined : '1px solid #eee',
          borderBottom: isMobile ? '1px solid #eee' : undefined,
          display: 'flex',
          flexDirection: 'column',
          minWidth: isMobile ? undefined : 240,
          maxWidth: isMobile ? undefined : 340
        }}>
          <div style={{
            padding: '18px 18px 10px 18px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontWeight: 700, fontSize: 22 }}>Chats</span>
            <Search style={{ color: '#888', cursor: 'pointer' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {convData.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: conv.id === selectedId ? '#f0f2f5' : '#fff',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f6f6f6',
                  transition: 'background 0.18s'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={conv.avatar} alt={conv.name} style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: conv.unread ? '2px solid #FFD700' : '2px solid #eee'
                  }} />
                  {/* Online status */}
                  <span style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: conv.online ? '#45bd62' : '#bbb',
                    border: '2px solid #fff'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{conv.name}</div>
                  <div style={{
                    color: '#888',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 180
                  }}>{conv.lastMessage}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#bbb' }}>{conv.time}</div>
                  {conv.unread > 0 && (
                    <span style={{
                      display: 'inline-block',
                      background: '#FFD700',
                      color: '#222',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '2px 8px',
                      marginTop: 4
                    }}>{conv.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      ) : null}

      {/* Chat Area */}
      {selectedConversation && (
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#f7f9fa'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#fff'
          }}>
            <img src={selectedConversation.avatar} alt={selectedConversation.name} style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              objectFit: 'cover'
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{selectedConversation.name}</div>
              <div style={{ color: '#888', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                {selectedConversation.online ? (
                  <>
                    <CircleDot size={14} color="#45bd62" />
                    Active now
                  </>
                ) : (
                  <>
                    <CircleDot size={14} color="#bbb" />
                    Offline
                  </>
                )}
              </div>
            </div>
            <Phone style={{ color: '#1877f2', cursor: 'pointer', marginRight: 12 }}
            onClick={startAudioCall} />
            <Video
              style={{ color: '#1877f2', cursor: 'pointer', marginRight: 12 }}
              onClick={startCall}
            />
            <Info style={{ color: '#888', cursor: 'pointer', marginRight: 12 }} />
            <MoreVertical style={{ color: '#888', cursor: 'pointer' }} />
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            background: '#f7f9fa'
          }}>
            {selectedConversation.messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start'
                }}
              >
                <span style={{
                  background: msg.from === 'me' ? '#FFD700' : '#fff',
                  color: '#222',
                  borderRadius: 18,
                  padding: '10px 18px',
                  maxWidth: 340,
                  fontSize: 16,
                  boxShadow: '0 1px 4px #0001',
                  border: msg.from === 'me' ? '1px solid #FFD700' : '1px solid #eee'
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 10, height: 10, background: '#FFD700', borderRadius: '50%', display: 'inline-block', animation: 'blink 1s infinite alternate'
                }} />
                <span style={{ color: '#888', fontSize: 15 }}>Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div style={{
            padding: '18px 24px',
            borderTop: '1px solid #eee',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative'
          }}>
            {/* Emoji Picker */}
            <div style={{ position: 'relative' }}>
              <Smile
                style={{ color: '#f7b928', cursor: 'pointer', fontSize: 22 }}
                onClick={() => setShowEmoji(e => !e)}
              />
              {showEmoji && (
                <div style={{
                  position: 'absolute',
                  bottom: 36,
                  left: 0,
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0002',
                  padding: 10,
                  display: 'flex',
                  gap: 8,
                  zIndex: 10
                }}>
                  {emojiList.map(emoji => (
                    <span
                      key={emoji}
                      style={{ fontSize: 22, cursor: 'pointer' }}
                      onClick={() => {
                        setInput(input + emoji);
                        setShowEmoji(false);
                        inputRef.current?.focus();
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Paperclip style={{ color: '#888', cursor: 'pointer', fontSize: 22 }} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: '#f0f2f5',
                borderRadius: 18,
                padding: '12px 18px',
                fontSize: 16
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  sendMessage();
                }
              }}
            />
            <button
              style={{
                background: '#FFD700',
                color: '#222',
                border: 'none',
                borderRadius: 18,
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 1px 2px #0001'
              }}
              onClick={sendMessage}
            >
              <Send style={{ verticalAlign: 'middle' }} />
            </button>
          </div>

          {/* Video Call UI - WhatsApp Style */}
          {callActive && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
            //   background: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}>
              <div style={{
                position: 'relative',
                width: 380,
                height: 520,
                background: '#222',
                borderRadius: 24,
                boxShadow: '0 8px 32px #0008',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                {/* Remote Video (full area) */}
                <video
                  ref={remoteVideo}
                  autoPlay
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    background: '#000'
                  }}
                />
                {/* Top bar with avatar, name, and call status */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(34,34,34,0.85)',
                  padding: '18px 20px 12px 20px',
                  zIndex: 2
                }}>
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #FFD700',
                      marginRight: 14
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
                      {selectedConversation.name}
                    </div>
                    <div style={{ color: '#bdbdbd', fontSize: 14, marginTop: 2 }}>
                      Video call
                    </div>
                  </div>
                  {/* End Call Button */}
                  <button
                    onClick={endCall}
                    style={{
                      background: '#f5533d',
                      border: 'none',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      marginLeft: 8
                    }}
                    aria-label="End Call"
                    title="End Call"
                  >
                    <X color="#fff" size={24} />
                  </button>
                </div>
                {/* Local Video (small, bottom right) */}
                <div style={{
                  position: 'absolute',
                  bottom: 100,
                  right: 18,
                  width: 110,
                  height: 150,
                  borderRadius: 16,
                  overflow: 'hidden',
                //   border: '1px solid #FFD700',
                  background: '#000',
                  zIndex: 3,
                  boxShadow: '0 2px 8px #0008'
                }}>
                  <video
                    ref={localVideo}
                    autoPlay
                    muted={localMuted}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                {/* Bottom bar with mute and end call */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 36,
                  background: 'rgba(34,34,34,0.92)',
                  padding: '18px 0 18px 0',
                  zIndex: 2
                }}>
                  {/* Mute/Unmute */}
                  <button
                    onClick={toggleMute}
                    style={{
                      background: '#FFD700',
                      border: 'none',
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    aria-label={localMuted ? "Unmute" : "Mute"}
                    title={localMuted ? "Unmute" : "Mute"}
                  >
                    {localMuted ? <MicOff color="#222" size={28} /> : <Mic color="#222" size={28} />}
                  </button>
                  {/* End Call (duplicate for WhatsApp style) */}
                  <button
                    onClick={endCall}
                    style={{
                      background: '#f5533d',
                      border: 'none',
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    aria-label="End Call"
                    title="End Call"
                  >
                    <Phone color="#fff" size={28} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audio Call UI - WhatsApp Style */}
          {audioCallActive && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}>
              <div style={{
                position: 'relative',
                width: 340,
                height: 420,
                background: '#222',
                borderRadius: 24,
                boxShadow: '0 8px 32px #0008',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                {/* Top bar with avatar, name, and call status */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(34,34,34,0.85)',
                  padding: '18px 20px 12px 20px',
                  zIndex: 2
                }}>
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #FFD700',
                      marginRight: 14
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
                      {selectedConversation.name}
                    </div>
                    <div style={{ color: '#bdbdbd', fontSize: 14, marginTop: 2 }}>
                      Audio call
                    </div>
                  </div>
                  {/* End Call Button */}
                  <button
                    onClick={endAudioCall}
                    style={{
                      background: '#f5533d',
                      border: 'none',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      marginLeft: 8
                    }}
                    aria-label="End Call"
                    title="End Call"
                  >
                    <X color="#fff" size={24} />
                  </button>
                </div>
                {/* Audio visualization or avatar in center */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #FFD700',
                      marginBottom: 18,
                      marginTop: 60
                    }}
                  />
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 22, marginBottom: 8 }}>
                    {selectedConversation.name}
                  </div>
                  <div style={{ color: '#bdbdbd', fontSize: 16 }}>
                    Calling...
                  </div>
                </div>
                {/* Bottom bar with mute and end call */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 36,
                  background: 'rgba(34,34,34,0.92)',
                  padding: '18px 0 18px 0',
                  zIndex: 2
                }}>
                  {/* Mute/Unmute */}
                  <button
                    onClick={toggleAudioMute}
                    style={{
                      background: '#FFD700',
                      border: 'none',
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    aria-label={audioMuted ? "Unmute" : "Mute"}
                    title={audioMuted ? "Unmute" : "Mute"}
                  >
                    {audioMuted ? <VolumeX color="#222" size={28} /> : <Volume2 color="#222" size={28} />}
                  </button>
                  {/* End Call */}
                  <button
                    onClick={endAudioCall}
                    style={{
                      background: '#f5533d',
                      border: 'none',
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    aria-label="End Call"
                    title="End Call"
                  >
                    <Phone color="#fff" size={28} />
                  </button>
                </div>
                {/* Hidden audio elements for streams */}
                <audio ref={localAudio} autoPlay muted={audioMuted} style={{ display: 'none' }} />
                <audio ref={remoteAudio} autoPlay style={{ display: 'none' }} />
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default Messages;

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let onlineUsers = {};

io.on('connection', socket => {
  socket.on('user-online', userId => {
    onlineUsers[userId] = socket.id;
    io.emit('online-users', Object.keys(onlineUsers));
  });
  socket.on('disconnect', () => {
    for (const [userId, id] of Object.entries(onlineUsers)) {
      if (id === socket.id) delete onlineUsers[userId];
    }
    io.emit('online-users', Object.keys(onlineUsers));
  });

  socket.on('call-user', data => {
    io.to(data.to).emit('call-made', { offer: data.offer, from: socket.id });
  });

  socket.on('make-answer', data => {
    io.to(data.to).emit('answer-made', { answer: data.answer, from: socket.id });
  });

  socket.on('ice-candidate', data => {
    io.to(data.to).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
  });

  socket.on('join', () => {
    socket.emit('your-id', socket.id);
  });
});

server.listen(5002, () => console.log('Signaling server running on http://localhost:5002'));
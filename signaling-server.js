// signaling-server.js

const http = require('http');
const { Server } = require('socket.io');

// إنشاء خادم HTTP
const server = http.createServer();
const io = new Server(server, {
  path: '/ws',
  cors: { origin: '*' }
});

io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('peer-joined', socket.id);
  });

  socket.on('offer', ({ to, offer }) => {
    socket.to(to).emit('offer', { from: socket.id, offer });
  });

  socket.on('answer', ({ to, answer }) => {
    socket.to(to).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });
});

const PORT = process.env.SIGNALING_PORT || 3002;
server.listen(PORT, () => {
  console.log(`Signaling server running on :${PORT}`);
});

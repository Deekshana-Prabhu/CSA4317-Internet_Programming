const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Track active rooms and participants in memory
const rooms = new Map();

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'UniMed Connect WebRTC Signaling Server',
    activeRooms: rooms.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/rooms', (req, res) => {
  const roomList = [];
  rooms.forEach((participants, roomId) => {
    roomList.push({
      roomId,
      participantCount: participants.size,
      participants: Array.from(participants.keys())
    });
  });
  res.json({ rooms: roomList });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  if (rooms.has(roomId)) {
    const participants = Array.from(rooms.get(roomId).values());
    res.json({ roomId, active: true, count: participants.length, participants });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

io.on('connection', (socket) => {
  console.log(`[Signaling] Socket connected: ${socket.id}`);

  // Join a video room (Classroom or Doctor Consultation)
  socket.on('join-room', ({ roomId, userId, userName, role }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const roomParticipants = rooms.get(roomId);
    roomParticipants.set(socket.id, { socketId: socket.id, userId, userName, role, joinedAt: new Date() });

    console.log(`[Signaling] User '${userName}' (${userId}, role: ${role}) joined room: ${roomId}. Total: ${roomParticipants.size}`);

    // Notify others in room
    socket.to(roomId).emit('user-connected', {
      socketId: socket.id,
      userId,
      userName,
      role
    });

    // Send existing participants list to new joiner
    const existing = [];
    roomParticipants.forEach((info, sId) => {
      if (sId !== socket.id) existing.push(info);
    });
    socket.emit('room-users', existing);
  });

  // Relay WebRTC SDP Offer
  socket.on('offer', ({ targetSocketId, sdp }) => {
    console.log(`[Signaling] Relaying Offer from ${socket.id} to ${targetSocketId}`);
    socket.to(targetSocketId).emit('offer', {
      senderSocketId: socket.id,
      sdp
    });
  });

  // Relay WebRTC SDP Answer
  socket.on('answer', ({ targetSocketId, sdp }) => {
    console.log(`[Signaling] Relaying Answer from ${socket.id} to ${targetSocketId}`);
    socket.to(targetSocketId).emit('answer', {
      senderSocketId: socket.id,
      sdp
    });
  });

  // Relay ICE Candidate
  socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
    socket.to(targetSocketId).emit('ice-candidate', {
      senderSocketId: socket.id,
      candidate
    });
  });

  // Handle explicit leave
  socket.on('leave-room', ({ roomId }) => {
    cleanupSocket(socket, roomId);
  });

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log(`[Signaling] Socket disconnected: ${socket.id}`);
    rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        cleanupSocket(socket, roomId);
      }
    });
  });

  function cleanupSocket(s, roomId) {
    if (rooms.has(roomId)) {
      const roomParticipants = rooms.get(roomId);
      const user = roomParticipants.get(s.id);
      roomParticipants.delete(s.id);
      s.to(roomId).emit('user-disconnected', { socketId: s.id, user });
      console.log(`[Signaling] User left room ${roomId}. Remaining: ${roomParticipants.size}`);
      if (roomParticipants.size === 0) {
        rooms.delete(roomId);
        console.log(`[Signaling] Room ${roomId} cleaned up.`);
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` UniMed Connect WebRTC Signaling Server listening on :${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});

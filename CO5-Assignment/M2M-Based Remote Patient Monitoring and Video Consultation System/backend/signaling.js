/**
 * RemoteCare M2M Healthcare - WebRTC Signaling Service
 * Manages consultation room creation, peer negotiation, offer/answer exchange,
 * and ICE candidate dispatching via Socket.IO
 */

function initSignaling(io) {
  // Map of roomId -> Set of socket IDs
  const rooms = new Map();

  io.on('connection', (socket) => {
    console.log(`[Signaling] Peer connected: ${socket.id}`);

    // Join Consultation Room
    socket.on('join-room', ({ roomId, role, userName }) => {
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      const roomPeers = rooms.get(roomId);
      roomPeers.add(socket.id);

      console.log(`[Signaling] ${userName} (${role}, ${socket.id}) joined room: ${roomId}. Current peers: ${roomPeers.size}`);

      // Notify other peers in room
      socket.to(roomId).emit('peer-joined', {
        peerId: socket.id,
        role: role,
        userName: userName
      });

      // If room already has participants, notify new peer who is inside
      if (roomPeers.size > 1) {
        socket.emit('room-ready', {
          roomId: roomId,
          peerCount: roomPeers.size
        });
      }
    });

    // WebRTC Offer Exchange
    socket.on('offer', ({ roomId, sdp }) => {
      console.log(`[Signaling] Relaying WebRTC offer in room ${roomId} from ${socket.id}`);
      socket.to(roomId).emit('offer', {
        sdp: sdp,
        fromPeerId: socket.id
      });
    });

    // WebRTC Answer Exchange
    socket.on('answer', ({ roomId, sdp }) => {
      console.log(`[Signaling] Relaying WebRTC answer in room ${roomId} from ${socket.id}`);
      socket.to(roomId).emit('answer', {
        sdp: sdp,
        fromPeerId: socket.id
      });
    });

    // ICE Candidate Exchange
    socket.on('ice-candidate', ({ roomId, candidate }) => {
      socket.to(roomId).emit('ice-candidate', {
        candidate: candidate,
        fromPeerId: socket.id
      });
    });

    // Consultation Chat Relay
    socket.on('chat-message', ({ roomId, message, senderName, role }) => {
      io.to(roomId).emit('chat-message', {
        message: message,
        senderName: senderName,
        role: role,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    // Disconnect / Leave Room
    socket.on('leave-room', ({ roomId }) => {
      handlePeerLeave(socket, roomId);
    });

    socket.on('disconnect', () => {
      console.log(`[Signaling] Peer disconnected: ${socket.id}`);
      rooms.forEach((peers, roomId) => {
        if (peers.has(socket.id)) {
          handlePeerLeave(socket, roomId);
        }
      });
    });
  });

  function handlePeerLeave(socket, roomId) {
    socket.leave(roomId);
    if (rooms.has(roomId)) {
      const roomPeers = rooms.get(roomId);
      roomPeers.delete(socket.id);
      if (roomPeers.size === 0) {
        rooms.delete(roomId);
      } else {
        socket.to(roomId).emit('peer-left', {
          peerId: socket.id
        });
      }
    }
  }
}

module.exports = initSignaling;

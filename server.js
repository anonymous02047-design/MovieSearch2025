/**
 * Socket.io Server for MovieSearch 2025
 * Standalone WebSocket server for real-time features
 * 
 * Run this separately: node server.js
 */

const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

// Create HTTP server
const httpServer = createServer();

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store active connections
const activeUsers = new Map();
const rooms = new Map();

// Middleware
io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error('Invalid user ID'));
  }
  socket.userId = userId;
  next();
});

// Connection handler
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId} (${socket.id})`);
  
  // Track active user
  activeUsers.set(socket.userId, {
    socketId: socket.id,
    connectedAt: new Date(),
  });

  // Broadcast user count
  io.emit('user-count', activeUsers.size);

  // Join room
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room: ${roomId}`);
    
    // Track room members
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.userId);
    
    // Notify room members
    socket.to(roomId).emit('user-joined', {
      userId: socket.userId,
      timestamp: new Date(),
    });
    
    // Send room member count
    io.to(roomId).emit('room-users', Array.from(rooms.get(roomId)));
  });

  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User ${socket.userId} left room: ${roomId}`);
    
    // Remove from room tracking
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.userId);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }
    
    // Notify room members
    socket.to(roomId).emit('user-left', {
      userId: socket.userId,
      timestamp: new Date(),
    });
  });

  // Chat message
  socket.on('send-message', ({ roomId, message, metadata }) => {
    console.log(`Message in room ${roomId}:`, message);
    io.to(roomId).emit('new-message', {
      userId: socket.userId,
      message,
      metadata,
      timestamp: new Date(),
    });
  });

  // Watch party sync
  socket.on('watch-party-sync', ({ roomId, action, timestamp }) => {
    console.log(`Watch party sync in ${roomId}:`, action);
    socket.to(roomId).emit('sync-playback', {
      userId: socket.userId,
      action,
      timestamp,
    });
  });

  // Typing indicator
  socket.on('typing', ({ roomId, isTyping }) => {
    socket.to(roomId).emit('user-typing', {
      userId: socket.userId,
      isTyping,
    });
  });

  // User presence
  socket.on('presence', ({ status }) => {
    io.emit('user-presence', {
      userId: socket.userId,
      status,
      timestamp: new Date(),
    });
  });

  // Notification
  socket.on('notification', ({ userId, notification }) => {
    const userSocket = Array.from(io.sockets.sockets.values()).find(
      (s) => s.userId === userId
    );
    if (userSocket) {
      userSocket.emit('notification-received', notification);
    }
  });

  // Movie reaction (like, rate, etc.)
  socket.on('movie-reaction', ({ movieId, reaction, roomId }) => {
    if (roomId) {
      socket.to(roomId).emit('user-reacted', {
        userId: socket.userId,
        movieId,
        reaction,
        timestamp: new Date(),
      });
    }
  });

  // Live voting/polling
  socket.on('vote', ({ pollId, option, roomId }) => {
    io.to(roomId).emit('new-vote', {
      userId: socket.userId,
      pollId,
      option,
      timestamp: new Date(),
    });
  });

  // Trivia answer submission
  socket.on('trivia-answer', ({ questionId, answer, roomId }) => {
    io.to(roomId).emit('user-answered', {
      userId: socket.userId,
      questionId,
      timestamp: new Date(),
    });
  });

  // Disconnect handler
  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected: ${socket.userId} (${reason})`);
    
    // Remove from active users
    activeUsers.delete(socket.userId);
    
    // Remove from all rooms
    rooms.forEach((members, roomId) => {
      if (members.has(socket.userId)) {
        members.delete(socket.userId);
        socket.to(roomId).emit('user-left', {
          userId: socket.userId,
          timestamp: new Date(),
        });
      }
    });
    
    // Broadcast updated user count
    io.emit('user-count', activeUsers.size);
  });

  // Error handler
  socket.on('error', (error) => {
    console.error(`Socket error for user ${socket.userId}:`, error);
  });
});

// Server health check
httpServer.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      activeUsers: activeUsers.size,
      activeRooms: rooms.size,
      uptime: process.uptime(),
    }));
  }
});

// Start server
httpServer.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Socket.io Server - MovieSearch 2025      ║
╠════════════════════════════════════════════╣
║  Status: ✅ Running                        ║
║  Port: ${port}                                 ║
║  Mode: ${dev ? 'Development' : 'Production'}                      ║
║  Real-time features enabled! 🚀           ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing Socket.io server');
  httpServer.close(() => {
    console.log('Socket.io server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing Socket.io server');
  httpServer.close(() => {
    console.log('Socket.io server closed');
    process.exit(0);
  });
});


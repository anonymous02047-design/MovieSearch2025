/**
 * Socket.io Client Configuration
 * Real-time communication for watch parties, live chat, and notifications
 */

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

interface SocketConfig {
  url: string;
  path?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
}

const defaultConfig: SocketConfig = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  path: '/socket.io',
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
};

/**
 * Initialize Socket.io connection
 */
export const initSocket = (userId?: string, config: Partial<SocketConfig> = {}): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const finalConfig = { ...defaultConfig, ...config };

  socket = io(finalConfig.url, {
    path: finalConfig.path,
    autoConnect: finalConfig.autoConnect,
    reconnection: finalConfig.reconnection,
    reconnectionAttempts: finalConfig.reconnectionAttempts,
    reconnectionDelay: finalConfig.reconnectionDelay,
    timeout: finalConfig.timeout,
    transports: ['websocket', 'polling'], // Prefer WebSocket, fallback to polling
    auth: {
      userId,
    },
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket.io connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.io disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.io connection error:', error);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket.io reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Socket.io reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect_error', (error) => {
    console.error('Socket.io reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket.io reconnection failed');
  });

  return socket;
};

/**
 * Get existing socket instance
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Connect socket if not connected
 */
export const connectSocket = (): void => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

/**
 * Emit event to server
 */
export const emitEvent = (event: string, data?: any): void => {
  if (socket?.connected) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not connected. Cannot emit event:', event);
  }
};

/**
 * Listen to event from server
 */
export const onEvent = (event: string, callback: (data: any) => void): void => {
  if (socket) {
    socket.on(event, callback);
  }
};

/**
 * Remove event listener
 */
export const offEvent = (event: string, callback?: (data: any) => void): void => {
  if (socket) {
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};

/**
 * Join a room
 */
export const joinRoom = (roomId: string): void => {
  emitEvent('join-room', { roomId });
};

/**
 * Leave a room
 */
export const leaveRoom = (roomId: string): void => {
  emitEvent('leave-room', { roomId });
};

/**
 * Send message to room
 */
export const sendMessage = (roomId: string, message: string, metadata?: any): void => {
  emitEvent('send-message', {
    roomId,
    message,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Watch party sync event
 */
export const syncWatchParty = (roomId: string, action: 'play' | 'pause' | 'seek', timestamp?: number): void => {
  emitEvent('watch-party-sync', {
    roomId,
    action,
    timestamp,
  });
};

/**
 * Send typing indicator
 */
export const sendTyping = (roomId: string, isTyping: boolean): void => {
  emitEvent('typing', { roomId, isTyping });
};

/**
 * Send user presence update
 */
export const updatePresence = (status: 'online' | 'away' | 'offline'): void => {
  emitEvent('presence', { status });
};

/**
 * Send notification
 */
export const sendNotification = (userId: string, notification: any): void => {
  emitEvent('notification', { userId, notification });
};

// Export socket instance for direct access if needed
export default {
  initSocket,
  getSocket,
  connectSocket,
  disconnectSocket,
  emitEvent,
  onEvent,
  offEvent,
  joinRoom,
  leaveRoom,
  sendMessage,
  syncWatchParty,
  sendTyping,
  updatePresence,
  sendNotification,
};


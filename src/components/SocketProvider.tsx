'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';
import { initSocket, getSocket, connectSocket, disconnectSocket } from '@/lib/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  autoConnect = false 
}) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const socketInstance = initSocket(user.id);
      setSocket(socketInstance);

      // Connection event handlers
      socketInstance.on('connect', () => {
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
      });

      if (autoConnect) {
        socketInstance.connect();
      }

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user?.id, autoConnect]);

  const connect = useCallback(() => {
    connectSocket();
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    const socketInstance = getSocket();
    if (socketInstance?.connected) {
      socketInstance.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      if (callback) {
        socketInstance.off(event, callback);
      } else {
        socketInstance.off(event);
      }
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        connect,
        disconnect,
        emit,
        on,
        off,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};


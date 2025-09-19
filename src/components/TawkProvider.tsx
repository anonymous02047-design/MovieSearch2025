'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { tawkService, TawkConfig, TawkUser } from '@/lib/tawk';

interface TawkContextType {
  isLoaded: boolean;
  isConfigured: boolean;
  isVisible: boolean;
  isChatActive: boolean;
  chatStatus: 'online' | 'offline' | 'away' | 'busy';
  agent: any;
  user: TawkUser | null;
  config: TawkConfig;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  maximize: () => void;
  minimize: () => void;
  startChat: () => void;
  endChat: () => void;
  sendMessage: (message: string) => void;
  setUser: (user: TawkUser) => void;
  addTags: (tags: string[]) => void;
  removeTags: (tags: string[]) => void;
  setCustomFields: (fields: Record<string, any>) => void;
  setGreetingMessage: (message: string) => void;
  setOfflineMessage: (message: string) => void;
  setPosition: (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setEnabled: (enabled: boolean) => void;
  reset: () => void;
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
}

const TawkContext = createContext<TawkContextType | null>(null);

interface TawkProviderProps {
  children: ReactNode;
  config?: Partial<TawkConfig>;
  user?: TawkUser;
  autoInitialize?: boolean;
  autoShow?: boolean;
  onChatStarted?: (event: any) => void;
  onChatEnded?: (event: any) => void;
  onMessageSent?: (event: any) => void;
  onMessageReceived?: (event: any) => void;
  onWidgetOpened?: (event: any) => void;
  onWidgetClosed?: (event: any) => void;
  onAgentJoined?: (event: any) => void;
  onAgentLeft?: (event: any) => void;
}

export function TawkProvider({
  children,
  config,
  user,
  autoInitialize = true,
  autoShow = false,
  onChatStarted,
  onChatEnded,
  onMessageSent,
  onMessageReceived,
  onWidgetOpened,
  onWidgetClosed,
  onAgentJoined,
  onAgentLeft,
}: TawkProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatStatus, setChatStatus] = useState<'online' | 'offline' | 'away' | 'busy'>('offline');
  const [agent, setAgent] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<TawkUser | null>(null);

  useEffect(() => {
    // Update configuration if provided
    if (config) {
      tawkService.updateConfig(config);
    }

    // Check if Tawk.to is configured
    setIsConfigured(tawkService.isConfigured());

    // Set user if provided
    if (user) {
      setCurrentUser(user);
    }

    // Auto-initialize if enabled
    if (autoInitialize && tawkService.isConfigured()) {
      initializeTawk();
    }
  }, [config, user, autoInitialize]);

  const initializeTawk = async () => {
    try {
      // Wait for Tawk.to to load
      const checkLoaded = () => {
        if (tawkService.isTawkLoaded()) {
          setIsLoaded(true);
          if (autoShow) {
            tawkService.show();
            setIsVisible(true);
          }
          setupEventListeners();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    } catch (error) {
      console.error('Failed to initialize Tawk.to:', error);
    }
  };

  const setupEventListeners = () => {
    // Chat started
    tawkService.on('chat_started', (event: any) => {
      setIsChatActive(true);
      onChatStarted?.(event);
    });

    // Chat ended
    tawkService.on('chat_ended', (event: any) => {
      setIsChatActive(false);
      onChatEnded?.(event);
    });

    // Message sent
    tawkService.on('message_sent', (event: any) => {
      onMessageSent?.(event);
    });

    // Message received
    tawkService.on('message_received', (event: any) => {
      onMessageReceived?.(event);
    });

    // Widget opened
    tawkService.on('widget_opened', (event: any) => {
      setIsVisible(true);
      onWidgetOpened?.(event);
    });

    // Widget closed
    tawkService.on('widget_closed', (event: any) => {
      setIsVisible(false);
      onWidgetClosed?.(event);
    });

    // Agent joined
    tawkService.on('agent_joined', (event: any) => {
      setAgent(event.data?.agent);
      onAgentJoined?.(event);
    });

    // Agent left
    tawkService.on('agent_left', (event: any) => {
      setAgent(null);
      onAgentLeft?.(event);
    });
  };

  const show = () => {
    tawkService.show();
    setIsVisible(true);
  };

  const hide = () => {
    tawkService.hide();
    setIsVisible(false);
  };

  const toggle = () => {
    tawkService.toggle();
    setIsVisible(prev => !prev);
  };

  const maximize = () => {
    tawkService.maximize();
  };

  const minimize = () => {
    tawkService.minimize();
  };

  const startChat = () => {
    tawkService.startChat();
    setIsChatActive(true);
  };

  const endChat = () => {
    tawkService.endChat();
    setIsChatActive(false);
  };

  const sendMessage = (message: string) => {
    tawkService.sendMessage(message);
  };

  const setUser = (user: TawkUser) => {
    tawkService.setUser(user);
    setCurrentUser(user);
  };

  const addTags = (tags: string[]) => {
    tawkService.addTags(tags);
    if (currentUser) {
      const currentTags = currentUser.tags || [];
      const newTags = [...new Set([...currentTags, ...tags])];
      setCurrentUser({
        ...currentUser,
        tags: newTags,
      });
    }
  };

  const removeTags = (tags: string[]) => {
    tawkService.removeTags(tags);
    if (currentUser) {
      const currentTags = currentUser.tags || [];
      const newTags = currentTags.filter(tag => !tags.includes(tag));
      setCurrentUser({
        ...currentUser,
        tags: newTags,
      });
    }
  };

  const setCustomFields = (fields: Record<string, any>) => {
    tawkService.setCustomFields(fields);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        customFields: {
          ...currentUser.customFields,
          ...fields,
        },
      });
    }
  };

  const setGreetingMessage = (message: string) => {
    tawkService.setGreetingMessage(message);
  };

  const setOfflineMessage = (message: string) => {
    tawkService.setOfflineMessage(message);
  };

  const setPosition = (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => {
    tawkService.setPosition(position);
  };

  const setTheme = (theme: 'light' | 'dark' | 'auto') => {
    tawkService.setTheme(theme);
  };

  const setEnabled = (enabled: boolean) => {
    tawkService.setEnabled(enabled);
  };

  const reset = () => {
    tawkService.reset();
    setIsLoaded(false);
    setIsVisible(false);
    setIsChatActive(false);
    setChatStatus('offline');
    setAgent(null);
    setCurrentUser(null);
  };

  const on = (event: string, callback: Function) => {
    tawkService.on(event, callback);
  };

  const off = (event: string, callback: Function) => {
    tawkService.off(event, callback);
  };

  // Update chat status periodically
  useEffect(() => {
    if (!isLoaded) return;

    const updateStatus = () => {
      const status = tawkService.getChatStatus();
      setChatStatus(status);
      setAgent(tawkService.getAgent());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [isLoaded]);

  const contextValue: TawkContextType = {
    isLoaded,
    isConfigured,
    isVisible,
    isChatActive,
    chatStatus,
    agent,
    user: currentUser,
    config: tawkService.getConfig(),
    show,
    hide,
    toggle,
    maximize,
    minimize,
    startChat,
    endChat,
    sendMessage,
    setUser,
    addTags,
    removeTags,
    setCustomFields,
    setGreetingMessage,
    setOfflineMessage,
    setPosition,
    setTheme,
    setEnabled,
    reset,
    on,
    off,
  };

  return (
    <TawkContext.Provider value={contextValue}>
      {children}
    </TawkContext.Provider>
  );
}

export function useTawkContext(): TawkContextType {
  const context = useContext(TawkContext);
  if (!context) {
    throw new Error('useTawkContext must be used within a TawkProvider');
  }
  return context;
}

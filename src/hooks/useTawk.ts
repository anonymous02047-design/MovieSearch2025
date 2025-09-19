import { useState, useEffect, useCallback, useRef } from 'react';
import { tawkService, TawkUser, TawkEvent } from '@/lib/tawk';

export interface UseTawkOptions {
  autoInitialize?: boolean;
  autoShow?: boolean;
  user?: TawkUser;
  onChatStarted?: (event: TawkEvent) => void;
  onChatEnded?: (event: TawkEvent) => void;
  onMessageSent?: (event: TawkEvent) => void;
  onMessageReceived?: (event: TawkEvent) => void;
  onWidgetOpened?: (event: TawkEvent) => void;
  onWidgetClosed?: (event: TawkEvent) => void;
  onAgentJoined?: (event: TawkEvent) => void;
  onAgentLeft?: (event: TawkEvent) => void;
}

export interface UseTawkReturn {
  // State
  isLoaded: boolean;
  isConfigured: boolean;
  isVisible: boolean;
  isChatActive: boolean;
  chatStatus: 'online' | 'offline' | 'away' | 'busy';
  agent: any;
  user: TawkUser | null;
  lastEvent: TawkEvent | null;
  
  // Actions
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
  
  // Events
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
}

export function useTawk(options: UseTawkOptions = {}): UseTawkReturn {
  const {
    autoInitialize = true,
    autoShow = false,
    user,
    onChatStarted,
    onChatEnded,
    onMessageSent,
    onMessageReceived,
    onWidgetOpened,
    onWidgetClosed,
    onAgentJoined,
    onAgentLeft,
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatStatus, setChatStatus] = useState<'online' | 'offline' | 'away' | 'busy'>('offline');
  const [agent, setAgent] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<TawkUser | null>(null);
  const [lastEvent, setLastEvent] = useState<TawkEvent | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setIsConfigured(tawkService.isConfigured());

    if (autoInitialize && tawkService.isConfigured()) {
      initializeTawk();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [autoInitialize]);

  useEffect(() => {
    if (user && isLoaded) {
      setUser(user);
    }
  }, [user, isLoaded]);

  const initializeTawk = useCallback(async () => {
    try {
      // Wait for Tawk.to to load
      const checkLoaded = () => {
        if (tawkService.isTawkLoaded()) {
          setIsLoaded(true);
          if (autoShow) {
            tawkService.show();
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
  }, [autoShow]);

  const setupEventListeners = useCallback(() => {
    if (!mountedRef.current) return;

    // Chat started
    tawkService.on('chat_started', (event: TawkEvent) => {
      if (mountedRef.current) {
        setIsChatActive(true);
        setLastEvent(event);
        onChatStarted?.(event);
      }
    });

    // Chat ended
    tawkService.on('chat_ended', (event: TawkEvent) => {
      if (mountedRef.current) {
        setIsChatActive(false);
        setLastEvent(event);
        onChatEnded?.(event);
      }
    });

    // Message sent
    tawkService.on('message_sent', (event: TawkEvent) => {
      if (mountedRef.current) {
        setLastEvent(event);
        onMessageSent?.(event);
      }
    });

    // Message received
    tawkService.on('message_received', (event: TawkEvent) => {
      if (mountedRef.current) {
        setLastEvent(event);
        onMessageReceived?.(event);
      }
    });

    // Widget opened
    tawkService.on('widget_opened', (event: TawkEvent) => {
      if (mountedRef.current) {
        setIsVisible(true);
        setLastEvent(event);
        onWidgetOpened?.(event);
      }
    });

    // Widget closed
    tawkService.on('widget_closed', (event: TawkEvent) => {
      if (mountedRef.current) {
        setIsVisible(false);
        setLastEvent(event);
        onWidgetClosed?.(event);
      }
    });

    // Agent joined
    tawkService.on('agent_joined', (event: TawkEvent) => {
      if (mountedRef.current) {
        setAgent(event.data?.agent);
        setLastEvent(event);
        onAgentJoined?.(event);
      }
    });

    // Agent left
    tawkService.on('agent_left', (event: TawkEvent) => {
      if (mountedRef.current) {
        setAgent(null);
        setLastEvent(event);
        onAgentLeft?.(event);
      }
    });
  }, [onChatStarted, onChatEnded, onMessageSent, onMessageReceived, onWidgetOpened, onWidgetClosed, onAgentJoined, onAgentLeft]);

  const show = useCallback(() => {
    tawkService.show();
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    tawkService.hide();
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    tawkService.toggle();
    setIsVisible(prev => !prev);
  }, []);

  const maximize = useCallback(() => {
    tawkService.maximize();
  }, []);

  const minimize = useCallback(() => {
    tawkService.minimize();
  }, []);

  const startChat = useCallback(() => {
    tawkService.startChat();
    setIsChatActive(true);
  }, []);

  const endChat = useCallback(() => {
    tawkService.endChat();
    setIsChatActive(false);
  }, []);

  const sendMessage = useCallback((message: string) => {
    tawkService.sendMessage(message);
  }, []);

  const setUser = useCallback((user: TawkUser) => {
    tawkService.setUser(user);
    setCurrentUser(user);
  }, []);

  const addTags = useCallback((tags: string[]) => {
    tawkService.addTags(tags);
    if (currentUser) {
      const currentTags = currentUser.tags || [];
      const newTags = [...new Set([...currentTags, ...tags])];
      setCurrentUser({
        ...currentUser,
        tags: newTags,
      });
    }
  }, [currentUser]);

  const removeTags = useCallback((tags: string[]) => {
    tawkService.removeTags(tags);
    if (currentUser) {
      const currentTags = currentUser.tags || [];
      const newTags = currentTags.filter(tag => !tags.includes(tag));
      setCurrentUser({
        ...currentUser,
        tags: newTags,
      });
    }
  }, [currentUser]);

  const setCustomFields = useCallback((fields: Record<string, any>) => {
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
  }, [currentUser]);

  const setGreetingMessage = useCallback((message: string) => {
    tawkService.setGreetingMessage(message);
  }, []);

  const setOfflineMessage = useCallback((message: string) => {
    tawkService.setOfflineMessage(message);
  }, []);

  const setPosition = useCallback((position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => {
    tawkService.setPosition(position);
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    tawkService.setTheme(theme);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    tawkService.setEnabled(enabled);
  }, []);

  const reset = useCallback(() => {
    tawkService.reset();
    setIsLoaded(false);
    setIsVisible(false);
    setIsChatActive(false);
    setChatStatus('offline');
    setAgent(null);
    setCurrentUser(null);
    setLastEvent(null);
  }, []);

  const on = useCallback((event: string, callback: Function) => {
    tawkService.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback: Function) => {
    tawkService.off(event, callback);
  }, []);

  // Update chat status periodically
  useEffect(() => {
    if (!isLoaded) return;

    const updateStatus = () => {
      if (mountedRef.current) {
        const status = tawkService.getChatStatus();
        setChatStatus(status);
        setAgent(tawkService.getAgent());
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [isLoaded]);

  return {
    // State
    isLoaded,
    isConfigured,
    isVisible,
    isChatActive,
    chatStatus,
    agent,
    user: currentUser,
    lastEvent,
    
    // Actions
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
    
    // Events
    on,
    off,
  };
}

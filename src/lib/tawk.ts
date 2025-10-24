import { errorHandler } from './errorHandler';

export interface TawkConfig {
  propertyId: string;
  widgetId: string;
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'light' | 'dark' | 'auto';
  showOnMobile: boolean;
  showOnDesktop: boolean;
  autoStart: boolean;
  greetingMessage: string;
  offlineMessage: string;
  customCSS?: string;
  customJS?: string;
}

export interface TawkUser {
  name?: string;
  email?: string;
  hash?: string;
  phone?: string;
  avatar?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface TawkEvent {
  type: 'chat_started' | 'chat_ended' | 'message_sent' | 'message_received' | 'widget_opened' | 'widget_closed' | 'agent_joined' | 'agent_left';
  data?: any;
  timestamp: number;
}

class TawkService {
  private config: TawkConfig;
  private isLoaded: boolean = false;
  private isInitialized: boolean = false;
  private tawk: any = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private user: TawkUser | null = null;

  constructor() {
    this.config = {
      propertyId: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || '',
      widgetId: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || '',
      enabled: !!(process.env.NEXT_PUBLIC_TAWK_ENABLED === 'true' && 
               process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID && 
               process.env.NEXT_PUBLIC_TAWK_WIDGET_ID &&
               process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID !== 'your-property-id' &&
               process.env.NEXT_PUBLIC_TAWK_WIDGET_ID !== 'your-widget-id'),
      position: (process.env.NEXT_PUBLIC_TAWK_POSITION as any) || 'bottom-right',
      theme: (process.env.NEXT_PUBLIC_TAWK_THEME as any) || 'auto',
      showOnMobile: process.env.NEXT_PUBLIC_TAWK_SHOW_MOBILE !== 'false',
      showOnDesktop: process.env.NEXT_PUBLIC_TAWK_SHOW_DESKTOP !== 'false',
      autoStart: process.env.NEXT_PUBLIC_TAWK_AUTO_START === 'true',
      greetingMessage: process.env.NEXT_PUBLIC_TAWK_GREETING_MESSAGE || 'Hello! How can we help you today?',
      offlineMessage: process.env.NEXT_PUBLIC_TAWK_OFFLINE_MESSAGE || 'We are currently offline. Please leave a message and we will get back to you soon.',
    };

    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initialize Tawk.to
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized || !this.config.enabled || !this.config.propertyId) {
      return;
    }

    try {
      await this.loadScript();
      this.setupEventListeners();
      this.applyCustomStyling();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Tawk.to:', error);
    }
  }

  /**
   * Load Tawk.to script
   */
  private async loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        resolve();
        return;
      }

      // Check if script is already loaded
      if (typeof window !== 'undefined' && (window as any).Tawk_API) {
        this.tawk = (window as any).Tawk_API;
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${this.config.propertyId}/${this.config.widgetId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      script.onload = () => {
        this.tawk = (window as any).Tawk_API;
        this.isLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Tawk.to script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.tawk) return;

    // Chat started
    this.tawk.onChatStarted = () => {
      this.emit('chat_started', { timestamp: Date.now() });
    };

    // Chat ended
    this.tawk.onChatEnded = () => {
      this.emit('chat_ended', { timestamp: Date.now() });
    };

    // Message sent
    this.tawk.onMessageSent = (message: any) => {
      this.emit('message_sent', { message, timestamp: Date.now() });
    };

    // Message received
    this.tawk.onMessageReceived = (message: any) => {
      this.emit('message_received', { message, timestamp: Date.now() });
    };

    // Widget opened
    this.tawk.onWidgetOpen = () => {
      this.emit('widget_opened', { timestamp: Date.now() });
    };

    // Widget closed
    this.tawk.onWidgetClose = () => {
      this.emit('widget_closed', { timestamp: Date.now() });
    };

    // Agent joined
    this.tawk.onAgentJoin = (agent: any) => {
      this.emit('agent_joined', { agent, timestamp: Date.now() });
    };

    // Agent left
    this.tawk.onAgentLeave = (agent: any) => {
      this.emit('agent_left', { agent, timestamp: Date.now() });
    };
  }

  /**
   * Apply custom styling
   */
  private applyCustomStyling(): void {
    if (!this.config.customCSS) return;

    const style = document.createElement('style');
    style.textContent = this.config.customCSS;
    document.head.appendChild(style);
  }

  /**
   * Show the chat widget
   */
  show(): void {
    if (!this.tawk) return;
    this.tawk.showWidget();
  }

  /**
   * Hide the chat widget
   */
  hide(): void {
    if (!this.tawk) return;
    this.tawk.hideWidget();
  }

  /**
   * Toggle the chat widget
   */
  toggle(): void {
    if (!this.tawk) return;
    this.tawk.toggle();
  }

  /**
   * Maximize the chat widget
   */
  maximize(): void {
    if (!this.tawk) return;
    this.tawk.maximize();
  }

  /**
   * Minimize the chat widget
   */
  minimize(): void {
    if (!this.tawk) return;
    this.tawk.minimize();
  }

  /**
   * Set user information
   */
  setUser(user: TawkUser): void {
    if (!this.tawk) return;

    this.user = user;
    this.tawk.setAttributes({
      name: user.name || '',
      email: user.email || '',
      hash: user.hash || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      tags: user.tags || [],
      customFields: user.customFields || {},
    });
  }

  /**
   * Get current user information
   */
  getUser(): TawkUser | null {
    return this.user;
  }

  /**
   * Add tags to user
   */
  addTags(tags: string[]): void {
    if (!this.tawk || !this.user) return;

    const currentTags = this.user.tags || [];
    const newTags = [...new Set([...currentTags, ...tags])];
    
    this.setUser({
      ...this.user,
      tags: newTags,
    });
  }

  /**
   * Remove tags from user
   */
  removeTags(tags: string[]): void {
    if (!this.tawk || !this.user) return;

    const currentTags = this.user.tags || [];
    const newTags = currentTags.filter(tag => !tags.includes(tag));
    
    this.setUser({
      ...this.user,
      tags: newTags,
    });
  }

  /**
   * Set custom fields
   */
  setCustomFields(fields: Record<string, any>): void {
    if (!this.tawk || !this.user) return;

    this.setUser({
      ...this.user,
      customFields: {
        ...this.user.customFields,
        ...fields,
      },
    });
  }

  /**
   * Send a message
   */
  sendMessage(message: string): void {
    if (!this.tawk) return;
    this.tawk.sendMessage(message);
  }

  /**
   * Start a chat
   */
  startChat(): void {
    if (!this.tawk) return;
    this.tawk.startChat();
  }

  /**
   * End a chat
   */
  endChat(): void {
    if (!this.tawk) return;
    this.tawk.endChat();
  }

  /**
   * Check if chat is active
   */
  isChatActive(): boolean {
    if (!this.tawk) return false;
    return this.tawk.isChatActive();
  }

  /**
   * Check if widget is visible
   */
  isWidgetVisible(): boolean {
    if (!this.tawk) return false;
    return this.tawk.isWidgetVisible();
  }

  /**
   * Get chat status
   */
  getChatStatus(): 'online' | 'offline' | 'away' | 'busy' {
    if (!this.tawk) return 'offline';
    return this.tawk.getChatStatus();
  }

  /**
   * Get agent information
   */
  getAgent(): any {
    if (!this.tawk) return null;
    return this.tawk.getAgent();
  }

  /**
   * Get chat history
   */
  getChatHistory(): any[] {
    if (!this.tawk) return [];
    return this.tawk.getChatHistory();
  }

  /**
   * Clear chat history
   */
  clearChatHistory(): void {
    if (!this.tawk) return;
    this.tawk.clearChatHistory();
  }

  /**
   * Set greeting message
   */
  setGreetingMessage(message: string): void {
    if (!this.tawk) return;
    this.tawk.setGreetingMessage(message);
  }

  /**
   * Set offline message
   */
  setOfflineMessage(message: string): void {
    if (!this.tawk) return;
    this.tawk.setOfflineMessage(message);
  }

  /**
   * Set widget position
   */
  setPosition(position: TawkConfig['position']): void {
    if (!this.tawk) return;
    this.tawk.setPosition(position);
  }

  /**
   * Set widget theme
   */
  setTheme(theme: TawkConfig['theme']): void {
    if (!this.tawk) return;
    this.tawk.setTheme(theme);
  }

  /**
   * Enable/disable widget
   */
  setEnabled(enabled: boolean): void {
    if (!this.tawk) return;
    if (enabled) {
      this.tawk.showWidget();
    } else {
      this.tawk.hideWidget();
    }
  }

  /**
   * Show widget on mobile
   */
  setShowOnMobile(show: boolean): void {
    if (!this.tawk) return;
    this.tawk.setShowOnMobile(show);
  }

  /**
   * Show widget on desktop
   */
  setShowOnDesktop(show: boolean): void {
    if (!this.tawk) return;
    this.tawk.setShowOnDesktop(show);
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   */
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in Tawk.to event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get configuration
   */
  getConfig(): TawkConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<TawkConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Check if Tawk.to is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.propertyId &&
      this.config.widgetId &&
      this.config.enabled &&
      this.config.propertyId !== 'your-property-id' &&
      this.config.widgetId !== 'your-widget-id' &&
      this.config.propertyId.length > 0 &&
      this.config.widgetId.length > 0
    );
  }

  /**
   * Check if Tawk.to is loaded
   */
  isTawkLoaded(): boolean {
    return this.isLoaded && !!this.tawk;
  }

  /**
   * Get widget element
   */
  getWidgetElement(): HTMLElement | null {
    if (typeof window !== 'undefined') {
      return document.querySelector('#tawk-widget') || document.querySelector('.tawk-widget');
    }
    return null;
  }

  /**
   * Destroy Tawk.to instance
   */
  destroy(): void {
    if (this.tawk && this.tawk.destroy) {
      this.tawk.destroy();
    }
    this.isLoaded = false;
    this.isInitialized = false;
    this.tawk = null;
    this.eventListeners.clear();
    this.user = null;
  }

  /**
   * Reset to default state
   */
  reset(): void {
    this.destroy();
    this.initialize();
  }
}

// Create and export a singleton instance
export const tawkService = new TawkService();

// Export the class for custom instances
export { TawkService };

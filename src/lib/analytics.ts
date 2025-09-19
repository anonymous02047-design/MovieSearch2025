/**
 * Enterprise-Grade User Interaction & Session Analytics System
 * Captures 47+ valuable fields per session with automatic server capture and client-side beacon
 */

import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Session data interface with 47+ fields
export interface SessionData {
  // Core session info
  sessionId: string;
  userId?: string; // Clerk user ID if available
  timestamp: number;
  
  // Network & Location
  ipAddress: string;
  country: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  timezone: string;
  countryCode: string;
  
  // Device & Hardware
  deviceType: string;
  deviceVendor?: string;
  deviceModel?: string;
  operatingSystem: string;
  osVersion?: string;
  cpuCores?: number;
  memorySize?: number;
  batteryStatus?: {
    level?: number;
    charging?: boolean;
  };
  
  // Browser & Display
  browser: string;
  browserVersion: string;
  browserEngine: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  colorDepth: number;
  
  // User Preferences & Capabilities
  language: string;
  cookiesEnabled: boolean;
  localStorageSupport: boolean;
  javascriptEnabled: boolean;
  browserPlugins?: string[];
  
  // Navigation & Behavior
  referrer: string;
  landingPage: string;
  currentPage: string;
  pagesVisited: string[];
  sessionDuration: number;
  
  // Network & Performance
  networkType?: string;
  connectionSpeed?: string;
  
  // Authentication & Source
  loginStatus: boolean;
  geoSource: string;
  sessionSource: string;
  
  // Events & Interactions
  events: SessionEvent[];
  
  // Custom valuable fields
  customField1?: string; // User engagement score
  customField2?: string; // Device risk level
  customField3?: string; // Session quality score
}

export interface SessionEvent {
  type: 'click' | 'form_submit' | 'scroll' | 'page_view' | 'search' | 'rating' | 'favorite' | 'watchlist' | 'custom';
  timestamp: number;
  page: string;
  element?: string;
  data?: any;
  scrollDepth?: number;
  formData?: any;
}

// Analytics service class
export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionsDir: string;
  private maxSessionsPerFile = 1000;
  private sessionRetentionDays = 30;

  private constructor() {
    this.sessionsDir = path.join(process.cwd(), 'data', 'sessions');
    // Ensure directory exists synchronously
    try {
      require('fs').mkdirSync(this.sessionsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create sessions directory:', error);
    }
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }


  // Extract client information from request
  public extractClientInfo(request: NextRequest): Partial<SessionData> {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || 'en';
    const referer = request.headers.get('referer') || '';
    
    // Extract IP and geolocation
    const ipAddress = this.getClientIP(request);
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    const region = request.headers.get('x-vercel-ip-region') || 'Unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
    
    // Parse user agent for device/browser info
    const deviceInfo = this.parseUserAgent(userAgent);
    
    return {
      ipAddress,
      country,
      region,
      city,
      countryCode: country,
      userAgent,
      language: acceptLanguage.split(',')[0] || 'en',
      referrer: referer,
      ...deviceInfo,
      cookiesEnabled: true, // Assume true for server-side
      localStorageSupport: true,
      javascriptEnabled: true,
      loginStatus: false, // Will be updated by client
      geoSource: 'server',
      sessionSource: 'direct',
      events: [],
      customField1: '0', // Engagement score
      customField2: 'low', // Device risk level
      customField3: 'good', // Session quality
    };
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    if (realIP) return realIP;
    if (cfConnectingIP) return cfConnectingIP;
    
    return request.ip || '127.0.0.1';
  }

  private parseUserAgent(userAgent: string): Partial<SessionData> {
    // Enhanced user agent parsing for better device detection
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(userAgent);
    const isTablet = /iPad|Tablet|PlayBook|Kindle|Silk/.test(userAgent);
    const isDesktop = /Windows|Macintosh|Linux|X11/.test(userAgent) && !isMobile && !isTablet;
    
    let deviceType = 'unknown';
    if (isTablet) deviceType = 'tablet';
    else if (isMobile) deviceType = 'mobile';
    else if (isDesktop) deviceType = 'desktop';
    
    // Extract browser info
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    let browserEngine = 'Unknown';
    let operatingSystem = 'Unknown';
    let osVersion = 'Unknown';
    
    // Browser detection
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Blink';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Gecko';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'WebKit';
    } else if (userAgent.includes('Edg')) {
      browser = 'Edge';
      const match = userAgent.match(/Edg\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Blink';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      browser = 'Opera';
      const match = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Blink';
    }
    
    // Enhanced OS detection
    if (userAgent.includes('Windows NT 10.0')) {
      operatingSystem = 'Windows';
      osVersion = '10/11';
    } else if (userAgent.includes('Windows NT 6.3')) {
      operatingSystem = 'Windows';
      osVersion = '8.1';
    } else if (userAgent.includes('Windows NT 6.2')) {
      operatingSystem = 'Windows';
      osVersion = '8';
    } else if (userAgent.includes('Windows NT 6.1')) {
      operatingSystem = 'Windows';
      osVersion = '7';
    } else if (userAgent.includes('Windows')) {
      operatingSystem = 'Windows';
      osVersion = 'Other';
    } else if (userAgent.includes('Mac OS X')) {
      operatingSystem = 'macOS';
      const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
      if (match) osVersion = match[1].replace('_', '.');
    } else if (userAgent.includes('Linux')) {
      operatingSystem = 'Linux';
      if (userAgent.includes('Ubuntu')) osVersion = 'Ubuntu';
      else if (userAgent.includes('Debian')) osVersion = 'Debian';
      else if (userAgent.includes('CentOS')) osVersion = 'CentOS';
      else if (userAgent.includes('Red Hat')) osVersion = 'Red Hat';
      else osVersion = 'Other';
    } else if (userAgent.includes('Android')) {
      operatingSystem = 'Android';
      const match = userAgent.match(/Android (\d+\.\d+)/);
      if (match) osVersion = match[1];
    } else if (userAgent.includes('iPhone OS') || userAgent.includes('iOS')) {
      operatingSystem = 'iOS';
      const match = userAgent.match(/OS (\d+[._]\d+)/);
      if (match) osVersion = match[1].replace('_', '.');
    } else if (userAgent.includes('iPad')) {
      operatingSystem = 'iPadOS';
      const match = userAgent.match(/OS (\d+[._]\d+)/);
      if (match) osVersion = match[1].replace('_', '.');
    }
    
    return {
      deviceType,
      browser,
      browserVersion,
      browserEngine,
      operatingSystem,
      osVersion,
    };
  }

  // Create new session
  public async createSession(request: NextRequest, userId?: string): Promise<string> {
    const sessionId = this.generateSessionId();
    const clientInfo = this.extractClientInfo(request);
    
    const sessionData: SessionData = {
      sessionId,
      userId,
      timestamp: Date.now(),
      landingPage: request.nextUrl.pathname,
      currentPage: request.nextUrl.pathname,
      pagesVisited: [request.nextUrl.pathname],
      sessionDuration: 0,
      events: [],
      ...clientInfo,
    } as SessionData;
    
    await this.saveSession(sessionData);
    return sessionId;
  }

  // Update session with new page or event
  public async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    try {
      const sessionData = await this.getSession(sessionId);
      if (!sessionData) return;
      
      const updatedSession = {
        ...sessionData,
        ...updates,
        sessionDuration: Date.now() - sessionData.timestamp,
      };
      
      await this.saveSession(updatedSession);
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  }

  // Add event to session
  public async addEvent(sessionId: string, event: SessionEvent): Promise<void> {
    try {
      const sessionData = await this.getSession(sessionId);
      if (!sessionData) return;
      
      sessionData.events.push(event);
      sessionData.sessionDuration = Date.now() - sessionData.timestamp;
      
      await this.saveSession(sessionData);
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  }

  // Save session to file
  private async saveSession(sessionData: SessionData): Promise<void> {
    try {
      const date = new Date(sessionData.timestamp);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const filePath = path.join(this.sessionsDir, `sessions_${dateStr}.json`);
      
      let sessions: SessionData[] = [];
      
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        sessions = JSON.parse(fileContent);
      } catch (error) {
        // File doesn't exist or is invalid, start with empty array
        sessions = [];
      }
      
      // Update existing session or add new one
      const existingIndex = sessions.findIndex(s => s.sessionId === sessionData.sessionId);
      if (existingIndex >= 0) {
        sessions[existingIndex] = sessionData;
      } else {
        sessions.push(sessionData);
      }
      
      // Keep only recent sessions if file gets too large
      if (sessions.length > this.maxSessionsPerFile) {
        sessions = sessions.slice(-this.maxSessionsPerFile);
      }
      
      await fs.writeFile(filePath, JSON.stringify(sessions, null, 2));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  // Get session by ID
  public async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      
      for (const file of files) {
        if (!file.startsWith('sessions_') || !file.endsWith('.json')) continue;
        
        const filePath = path.join(this.sessionsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        // Skip empty files
        if (!fileContent.trim()) continue;
        
        try {
          const sessions: SessionData[] = JSON.parse(fileContent);
          const session = sessions.find(s => s.sessionId === sessionId);
          if (session) return session;
        } catch (parseError) {
          console.warn(`Corrupted session file detected: ${file}, skipping...`);
          // Optionally backup and recreate the file
          const backupPath = filePath + '.corrupted';
          await fs.writeFile(backupPath, fileContent);
          await fs.writeFile(filePath, '[]');
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  // Get all sessions with filtering
  public async getSessions(filters: {
    dateFrom?: string;
    dateTo?: string;
    country?: string;
    deviceType?: string;
    browser?: string;
    userId?: string;
    ipAddress?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ sessions: SessionData[]; total: number }> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      let allSessions: SessionData[] = [];
      
      for (const file of files) {
        if (!file.startsWith('sessions_') || !file.endsWith('.json')) continue;
        
        const filePath = path.join(this.sessionsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        // Skip empty files
        if (!fileContent.trim()) continue;
        
        try {
          const sessions: SessionData[] = JSON.parse(fileContent);
          allSessions = allSessions.concat(sessions);
        } catch (parseError) {
          console.warn(`Corrupted session file detected: ${file}, skipping...`);
          // Optionally backup and recreate the file
          const backupPath = filePath + '.corrupted';
          await fs.writeFile(backupPath, fileContent);
          await fs.writeFile(filePath, '[]');
        }
      }
      
      // Apply filters
      let filteredSessions = allSessions;
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime();
        filteredSessions = filteredSessions.filter(s => s.timestamp >= fromDate);
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo).getTime();
        filteredSessions = filteredSessions.filter(s => s.timestamp <= toDate);
      }
      
      if (filters.country) {
        filteredSessions = filteredSessions.filter(s => 
          s.country.toLowerCase().includes(filters.country!.toLowerCase())
        );
      }
      
      if (filters.deviceType) {
        filteredSessions = filteredSessions.filter(s => s.deviceType === filters.deviceType);
      }
      
      if (filters.browser) {
        filteredSessions = filteredSessions.filter(s => 
          s.browser.toLowerCase().includes(filters.browser!.toLowerCase())
        );
      }
      
      if (filters.userId) {
        filteredSessions = filteredSessions.filter(s => s.userId === filters.userId);
      }
      
      if (filters.ipAddress) {
        filteredSessions = filteredSessions.filter(s => s.ipAddress === filters.ipAddress);
      }
      
      // Sort by timestamp (newest first)
      filteredSessions.sort((a, b) => b.timestamp - a.timestamp);
      
      const total = filteredSessions.length;
      const offset = filters.offset || 0;
      const limit = filters.limit || 50;
      
      const paginatedSessions = filteredSessions.slice(offset, offset + limit);
      
      return { sessions: paginatedSessions, total };
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return { sessions: [], total: 0 };
    }
  }

  // Get analytics summary
  public async getAnalyticsSummary(dateFrom?: string, dateTo?: string): Promise<{
    totalSessions: number;
    activeSessions: number;
    topCountries: Array<{ country: string; count: number }>;
    topDevices: Array<{ device: string; count: number }>;
    topOperatingSystems: Array<{ os: string; count: number }>;
    topBrowsers: Array<{ browser: string; count: number }>;
    mostVisitedPages: Array<{ page: string; count: number }>;
    topReferrers: Array<{ referrer: string; count: number }>;
  }> {
    try {
      const { sessions } = await this.getSessions({ dateFrom, dateTo, limit: 10000 });
      
      const now = Date.now();
      const activeThreshold = 30 * 60 * 1000; // 30 minutes
      
      const activeSessions = sessions.filter(s => 
        (now - s.timestamp) < activeThreshold
      ).length;
      
      // Count top countries
      const countryCounts = new Map<string, number>();
      sessions.forEach(s => {
        const count = countryCounts.get(s.country) || 0;
        countryCounts.set(s.country, count + 1);
      });
      
      // Count top devices
      const deviceCounts = new Map<string, number>();
      sessions.forEach(s => {
        const count = deviceCounts.get(s.deviceType) || 0;
        deviceCounts.set(s.deviceType, count + 1);
      });
      
      // Count top operating systems
      const osCounts = new Map<string, number>();
      sessions.forEach(s => {
        const count = osCounts.get(s.operatingSystem) || 0;
        osCounts.set(s.operatingSystem, count + 1);
      });
      
      // Count top browsers
      const browserCounts = new Map<string, number>();
      sessions.forEach(s => {
        const count = browserCounts.get(s.browser) || 0;
        browserCounts.set(s.browser, count + 1);
      });
      
      // Count most visited pages
      const pageCounts = new Map<string, number>();
      sessions.forEach(s => {
        s.pagesVisited.forEach(page => {
          const count = pageCounts.get(page) || 0;
          pageCounts.set(page, count + 1);
        });
      });
      
      // Count top referrers
      const referrerCounts = new Map<string, number>();
      sessions.forEach(s => {
        if (s.referrer) {
          const count = referrerCounts.get(s.referrer) || 0;
          referrerCounts.set(s.referrer, count + 1);
        }
      });
      
      return {
        totalSessions: sessions.length,
        activeSessions,
        topCountries: Array.from(countryCounts.entries())
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topDevices: Array.from(deviceCounts.entries())
          .map(([device, count]) => ({ device, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topOperatingSystems: Array.from(osCounts.entries())
          .map(([os, count]) => ({ os, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topBrowsers: Array.from(browserCounts.entries())
          .map(([browser, count]) => ({ browser, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        mostVisitedPages: Array.from(pageCounts.entries())
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topReferrers: Array.from(referrerCounts.entries())
          .map(([referrer, count]) => ({ referrer, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      };
    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        topCountries: [],
        topDevices: [],
        topOperatingSystems: [],
        topBrowsers: [],
        mostVisitedPages: [],
        topReferrers: [],
      };
    }
  }

  // Clean up old session files
  public async cleanupOldSessions(): Promise<void> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.sessionRetentionDays);
      
      for (const file of files) {
        if (!file.startsWith('sessions_') || !file.endsWith('.json')) continue;
        
        const dateStr = file.replace('sessions_', '').replace('.json', '');
        const fileDate = new Date(dateStr);
        
        if (fileDate < cutoffDate) {
          const filePath = path.join(this.sessionsDir, file);
          await fs.unlink(filePath);
          console.log(`Deleted old session file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old sessions:', error);
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export sessions to CSV
  public async exportSessionsToCSV(filters: any = {}): Promise<string> {
    try {
      const { sessions } = await this.getSessions({ ...filters, limit: 10000 });
      
      if (sessions.length === 0) {
        return 'No sessions found';
      }
      
      const headers = [
        'Session ID', 'User ID', 'Timestamp', 'IP Address', 'Country', 'Region', 'City',
        'Device Type', 'Browser', 'Browser Version', 'Operating System', 'Screen Width',
        'Screen Height', 'Language', 'Referrer', 'Landing Page', 'Current Page',
        'Session Duration', 'Login Status', 'Events Count'
      ];
      
      const rows = sessions.map(session => [
        session.sessionId,
        session.userId || '',
        new Date(session.timestamp).toISOString(),
        session.ipAddress,
        session.country,
        session.region,
        session.city,
        session.deviceType,
        session.browser,
        session.browserVersion,
        session.operatingSystem,
        session.screenWidth,
        session.screenHeight,
        session.language,
        session.referrer,
        session.landingPage,
        session.currentPage,
        session.sessionDuration,
        session.loginStatus,
        session.events.length
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      
      return csvContent;
    } catch (error) {
      console.error('Failed to export sessions to CSV:', error);
      return 'Export failed';
    }
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();

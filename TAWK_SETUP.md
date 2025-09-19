# Tawk.to Chatbot Integration Setup

This document provides comprehensive instructions for setting up Tawk.to chatbot integration in your Next.js application.

## 🚀 Quick Start

### 1. Get Tawk.to Account and Widget

1. Go to [Tawk.to](https://www.tawk.to/)
2. Sign up for a free account
3. Create a new property (website)
4. Get your **Property ID** and **Widget ID** from the dashboard

### 2. Environment Variables

Add these to your `.env` file:

```bash
# Tawk.to Configuration
NEXT_PUBLIC_TAWK_PROPERTY_ID=your-property-id-here
NEXT_PUBLIC_TAWK_WIDGET_ID=your-widget-id-here
NEXT_PUBLIC_TAWK_ENABLED=true
NEXT_PUBLIC_TAWK_POSITION=bottom-right
NEXT_PUBLIC_TAWK_THEME=auto
NEXT_PUBLIC_TAWK_SHOW_MOBILE=true
NEXT_PUBLIC_TAWK_SHOW_DESKTOP=true
NEXT_PUBLIC_TAWK_AUTO_START=false
NEXT_PUBLIC_TAWK_GREETING_MESSAGE=Hello! How can we help you today?
NEXT_PUBLIC_TAWK_OFFLINE_MESSAGE=We are currently offline. Please leave a message and we will get back to you soon.
```

### 3. Basic Usage

The Tawk.to widget is automatically initialized when you visit any page. You can also use the hooks and components:

#### Using the Hook

```tsx
import { useTawk } from '@/hooks/useTawk';

function MyComponent() {
  const {
    isLoaded,
    isConfigured,
    show,
    hide,
    startChat,
    setUser,
  } = useTawk();

  const handleStartChat = () => {
    if (isLoaded && isConfigured) {
      startChat();
    }
  };

  return (
    <button onClick={handleStartChat}>
      Start Chat
    </button>
  );
}
```

#### Using the Widget Component

```tsx
import TawkWidget from '@/components/TawkWidget';

function MyPage() {
  return (
    <div>
      {/* Your page content */}
      
      <TawkWidget
        position="bottom-right"
        theme="auto"
        showStatus={true}
        showAgent={true}
        customGreeting="Welcome to our support!"
      />
    </div>
  );
}
```

## 🔧 Advanced Configuration

### Widget Positions

```tsx
<TawkWidget position="bottom-right" />  // Default
<TawkWidget position="bottom-left" />
<TawkWidget position="top-right" />
<TawkWidget position="top-left" />
```

### Widget Themes

```tsx
<TawkWidget theme="light" />   // Light theme
<TawkWidget theme="dark" />    // Dark theme
<TawkWidget theme="auto" />    // Auto (follows system)
```

### User Management

```tsx
import { useTawk } from '@/hooks/useTawk';

function UserProfile() {
  const { setUser, addTags, setCustomFields } = useTawk();

  const handleSetUser = () => {
    setUser({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      tags: ['premium', 'vip'],
      customFields: {
        plan: 'premium',
        signupDate: '2024-01-01',
      },
    });
  };

  return (
    <button onClick={handleSetUser}>
      Set User Info
    </button>
  );
}
```

### Event Handling

```tsx
import { useTawk } from '@/hooks/useTawk';

function ChatTracker() {
  const { on, off } = useTawk({
    onChatStarted: () => {
      console.log('Chat started');
      // Track analytics
    },
    onMessageSent: (event) => {
      console.log('Message sent:', event);
    },
    onAgentJoined: (event) => {
      console.log('Agent joined:', event.data.agent);
    },
  });

  return <div>Chat tracking enabled</div>;
}
```

## 📊 Widget Features

### Status Indicators

The widget automatically shows:
- **Online**: Green indicator when agents are available
- **Offline**: Red indicator when no agents are online
- **Away**: Yellow indicator when agents are away
- **Busy**: Red indicator when agents are busy

### User Information

Set user information for better support:
- **Name**: User's display name
- **Email**: User's email address
- **Phone**: User's phone number
- **Tags**: Custom tags for categorization
- **Custom Fields**: Additional user data

### Message Features

- **Real-time messaging**: Instant message delivery
- **File attachments**: Send images and documents
- **Emoji support**: Rich emoji reactions
- **Typing indicators**: See when agents are typing
- **Message status**: Read receipts and delivery status

## 🎨 Customization

### Custom Styling

The widget includes custom CSS for better integration:

```css
/* Custom Tawk.to styling */
.tawk-widget {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.tawk-widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
```

### Custom Messages

```tsx
import { useTawk } from '@/hooks/useTawk';

function CustomMessages() {
  const { setGreetingMessage, setOfflineMessage } = useTawk();

  useEffect(() => {
    setGreetingMessage('Welcome to our premium support!');
    setOfflineMessage('We are currently offline. Our team will respond within 24 hours.');
  }, []);

  return <div>Custom messages set</div>;
}
```

## 🧪 Testing

### Test Page

Visit `/test-tawk` to test your configuration:

1. **Configuration Status**: Check if Tawk.to is properly configured
2. **Widget Controls**: Test show/hide/toggle functionality
3. **User Management**: Set user information and tags
4. **Message Testing**: Send test messages
5. **Widget Configuration**: Change position, theme, and settings
6. **Status Information**: View current widget and chat status

### Manual Testing

1. **Widget Visibility**: Check if the widget appears on your pages
2. **Chat Functionality**: Start a chat and send messages
3. **User Information**: Verify user data is passed correctly
4. **Responsive Design**: Test on mobile and desktop
5. **Theme Switching**: Test light/dark/auto themes

## 🐛 Troubleshooting

### Common Issues

#### 1. "Tawk.to not configured"
**Solution:**
- Check your `.env` file exists
- Verify the Property ID and Widget ID are correct
- Ensure `NEXT_PUBLIC_TAWK_ENABLED=true`
- Restart your development server

#### 2. "Widget not loading"
**Solution:**
- Check your internet connection
- Verify the Property ID and Widget ID are correct
- Check browser console for errors
- Ensure the domain is added in Tawk.to dashboard

#### 3. "Widget not visible"
**Solution:**
- Check if `NEXT_PUBLIC_TAWK_ENABLED=true`
- Verify the widget position settings
- Check if the widget is hidden by CSS
- Test with `show()` method

#### 4. "Chat not starting"
**Solution:**
- Check if agents are online in Tawk.to dashboard
- Verify the widget is properly loaded
- Check browser console for errors
- Test with different browsers

### Debug Mode

Enable debug mode for development:

```tsx
import { useTawk } from '@/hooks/useTawk';

function DebugTawk() {
  const { on } = useTawk({
    onChatStarted: (event) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Tawk.to Debug - Chat Started:', event);
      }
    },
    onMessageSent: (event) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Tawk.to Debug - Message Sent:', event);
      }
    },
  });

  return <div>Debug mode enabled</div>;
}
```

## 📱 Mobile Optimization

### Responsive Design

The widget automatically adapts to mobile devices:

- **Mobile Breakpoint**: 768px
- **Full Screen**: On mobile, the widget opens in full screen
- **Touch Optimized**: Optimized for touch interactions
- **Swipe Gestures**: Support for swipe to close

### Mobile Configuration

```bash
# Mobile-specific settings
NEXT_PUBLIC_TAWK_SHOW_MOBILE=true
NEXT_PUBLIC_TAWK_SHOW_DESKTOP=true
```

## 🔒 Security

### Data Protection

- **User Data**: Only necessary user information is shared
- **Privacy**: Tawk.to follows GDPR compliance
- **Encryption**: All communications are encrypted
- **Access Control**: Only authorized agents can access chats

### Best Practices

1. **Minimal Data**: Only share necessary user information
2. **Consent**: Get user consent before starting chats
3. **Data Retention**: Configure data retention policies
4. **Access Logs**: Monitor who accesses the chat system

## 📈 Analytics

### Event Tracking

The integration automatically tracks:

- **Chat Started**: When users start a chat
- **Chat Ended**: When chats are closed
- **Messages Sent**: User message count
- **Messages Received**: Agent response count
- **Widget Interactions**: Open/close events
- **Agent Activity**: Agent join/leave events

### Google Analytics Integration

```tsx
import { useTawk } from '@/hooks/useTawk';

function AnalyticsTawk() {
  const { on } = useTawk({
    onChatStarted: () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'chat_started', {
          'event_category': 'engagement',
          'event_label': 'tawk_chat'
        });
      }
    },
  });

  return <div>Analytics enabled</div>;
}
```

## 🚀 Production Deployment

### Environment Variables

For production, set these environment variables:

```bash
# Production Tawk.to Configuration
NEXT_PUBLIC_TAWK_PROPERTY_ID=your-production-property-id
NEXT_PUBLIC_TAWK_WIDGET_ID=your-production-widget-id
NEXT_PUBLIC_TAWK_ENABLED=true
NEXT_PUBLIC_TAWK_POSITION=bottom-right
NEXT_PUBLIC_TAWK_THEME=auto
NEXT_PUBLIC_TAWK_AUTO_START=true
```

### Performance Optimization

- **Lazy Loading**: Widget loads only when needed
- **Minimal Bundle**: Only essential code is included
- **Caching**: Widget resources are cached
- **CDN**: Tawk.to uses global CDN for fast loading

## 📚 API Reference

### useTawk Hook

```tsx
const {
  // State
  isLoaded,           // Whether Tawk.to is loaded
  isConfigured,       // Whether configuration is valid
  isVisible,          // Whether widget is visible
  isChatActive,       // Whether chat is active
  chatStatus,         // Current chat status
  agent,              // Current agent information
  user,               // Current user information
  lastEvent,          // Last event data
  
  // Actions
  show,               // Show widget
  hide,               // Hide widget
  toggle,             // Toggle widget visibility
  maximize,           // Maximize widget
  minimize,           // Minimize widget
  startChat,          // Start a chat
  endChat,            // End current chat
  sendMessage,        // Send a message
  setUser,            // Set user information
  addTags,            // Add user tags
  removeTags,         // Remove user tags
  setCustomFields,    // Set custom fields
  setGreetingMessage, // Set greeting message
  setOfflineMessage,  // Set offline message
  setPosition,        // Set widget position
  setTheme,           // Set widget theme
  setEnabled,         // Enable/disable widget
  reset,              // Reset widget state
  
  // Events
  on,                 // Add event listener
  off,                // Remove event listener
} = useTawk(options);
```

### TawkWidget Component

```tsx
<TawkWidget
  position="bottom-right"           // Widget position
  theme="auto"                      // Widget theme
  showStatus={true}                 // Show status indicator
  showAgent={true}                  // Show agent information
  showNotifications={true}          // Show notifications
  customGreeting="Hello!"           // Custom greeting message
  customOfflineMessage="Offline"    // Custom offline message
  onChatStarted={() => {}}          // Chat started callback
  onChatEnded={() => {}}            // Chat ended callback
  onMessageSent={(msg) => {}}       // Message sent callback
  onMessageReceived={(msg) => {}}   // Message received callback
  onWidgetOpened={() => {}}         // Widget opened callback
  onWidgetClosed={() => {}}         // Widget closed callback
  onAgentJoined={(agent) => {}}     // Agent joined callback
  onAgentLeft={(agent) => {}}       // Agent left callback
/>
```

## 🔗 Useful Links

- [Tawk.to Official Website](https://www.tawk.to/)
- [Tawk.to Documentation](https://www.tawk.to/knowledgebase/)
- [Tawk.to API Reference](https://www.tawk.to/knowledgebase/api/)
- [Tawk.to Dashboard](https://dashboard.tawk.to/)
- [Tawk.to Support](https://www.tawk.to/support/)

## 📝 License

This Tawk.to integration is part of your MovieSearch2025 application and follows the same license terms.

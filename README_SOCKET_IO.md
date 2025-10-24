# Socket.io Server Setup - OPTIONAL

## ⚠️ **Socket.io is OPTIONAL**

The Socket.io server (`server.js`) is for real-time features like:
- Watch parties
- Live chat
- Real-time notifications

**You can use the app without it!** All other features work fine.

---

## 🚀 **To Enable Socket.io (Optional):**

### **Step 1: Install Socket.io**
```bash
npm install socket.io
```

### **Step 2: Start Socket.io Server**
```bash
node server.js
```

### **Step 3: Verify**
- Server runs on port 3001
- Visit http://localhost:3001/health

---

## 🌐 **Cloudflare Alternative**

If using Cloudflare, you can use **Durable Objects** instead of Socket.io for real-time features!

**Benefits:**
- No separate server needed
- Runs at the edge (faster)
- Auto-scaling
- Free tier included

See `🌐_CLOUDFLARE_OPTIMIZATION_GUIDE.md` for details.

---

## ✅ **Current Status**

**Your app works perfectly without Socket.io!**

To run the app:
```bash
npm run dev
# Visit http://localhost:3000
```

All features except real-time chat/watch parties will work.


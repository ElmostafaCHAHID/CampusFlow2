const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Map of userId => Set of sockets
const userSockets = new Map();

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      // Expecting: { type: 'join', user_id: 123 }
      if (data.type === 'join' && data.user_id) {
        const id = String(data.user_id);
        ws.userId = id;
        if (!userSockets.has(id)) userSockets.set(id, new Set());
        userSockets.get(id).add(ws);
        console.log('User joined WS:', id);
      }
    } catch (e) {
      // ignore
    }
  });

  ws.on('close', () => {
    if (ws.userId && userSockets.has(ws.userId)) {
      userSockets.get(ws.userId).delete(ws);
    }
  });
});

// HTTP POST endpoint for backend to broadcast messages
app.post('/broadcast', (req, res) => {
  const payload = req.body;
  // payload expected: { recipient_id, sender_id, message }
  const recipientId = payload.recipient_id ? String(payload.recipient_id) : null;
  const senderId = payload.sender_id ? String(payload.sender_id) : null;

  const sendTo = (id, data) => {
    const set = userSockets.get(String(id));
    if (!set) return;
    for (const s of set) {
      if (s.readyState === WebSocket.OPEN) {
        try { s.send(JSON.stringify(data)); } catch (e) {}
      }
    }
  };

  // send to recipient
  if (recipientId) sendTo(recipientId, payload);
  // also send to sender so sender's UI can update in real-time
  if (senderId) sendTo(senderId, payload);

  res.json({ success: true });
});

// Simple ping to detect dead sockets
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

const PORT = process.env.PORT || 6001;
server.listen(PORT, () => console.log(`WebSocket broadcast server running on port ${PORT}`));

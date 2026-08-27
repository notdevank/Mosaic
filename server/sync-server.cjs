/**
 * Mosaic Life OS — Standalone Native Node.js Sync Server
 * Zero External Dependencies (Runs with standard Node.js runtime)
 * 
 * Launch locally or on a cloud server:
 *   node server/sync-server.cjs
 * 
 * Environment variables:
 *   PORT = 3002 (default)
 *   SECRET_TOKEN = 'mosaic-secret-key-123' (default)
 */

const http = require('http');

const PORT = process.env.PORT || 3002;
const SECRET_TOKEN = process.env.SECRET_TOKEN || 'mosaic-secret-key-123';

// In-memory data store snapshot
let currentState = null;
let lastSyncTimestamp = new Date().toISOString();

// Create HTTP server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'online', 
      app: 'Mosaic Sync Server',
      lastSyncedAt: lastSyncTimestamp,
      hasState: Boolean(currentState)
    }));
    return;
  }

  // REST API Sync Endpoint: /api/sync
  if (req.url === '/api/sync') {
    // Auth Check
    const authHeader = req.headers['authorization'];
    if (SECRET_TOKEN && authHeader !== `Bearer ${SECRET_TOKEN}`) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized. Invalid secret token.' }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          if (payload && payload.data) {
            currentState = payload.data;
            lastSyncTimestamp = new Date().toISOString();
            console.log(`[SyncServer] Received state update at ${lastSyncTimestamp} from client: ${payload.client || 'unknown'}`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              timestamp: lastSyncTimestamp,
              data: currentState 
            }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid payload schema. Missing data field.' }));
          }
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'JSON parse error' }));
        }
      });
    } else if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        timestamp: lastSyncTimestamp,
        data: currentState 
      }));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Mosaic Sync Server listening on port ${PORT}`);
  console.log(`   HTTP Endpoint : http://localhost:${PORT}/api/sync`);
  console.log(`   Health Check  : http://localhost:${PORT}/health`);
  console.log(`   Secret Token  : ${SECRET_TOKEN}`);
  console.log(`=======================================================`);
});

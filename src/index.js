import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import config from './config/config.js';
import { initializeDatabase } from './config/database.js';
import logMiddleware from './middleware/logger.js';
import { validateApiKey } from './middleware/apiKey.js';
import userRoutes from './routes/userRoutes.js';
import songRoutes from './routes/songRoutes.js';

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


await initializeDatabase();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);


app.use(express.static(path.join(__dirname, "frontend")));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html")); // ADDED
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});


app.use('/users', validateApiKey, userRoutes);
app.use('/songs', validateApiKey, songRoutes);


app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.isDevelopment() && { stack: err.stack })
  });
});


app.listen(config.port, () => {
  console.log(`✅ Server running on http://localhost:${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔒 API Key protection: ${config.apiKey ? 'ENABLED' : 'DISABLED'}`);
  console.log('\nAPI Endpoints:');
  console.log('  GET    /           - Welcome (public)');
  console.log('  GET    /health     - Health (public)');
  console.log('  GET    /users      - List users (protected)');
  console.log('  GET    /users/:id  - Get user (protected)');
  console.log('  POST   /users      - Create user (protected)');
  console.log('  PUT    /users/:id  - Update user (protected)');
  console.log('  DELETE /users/:id  - Delete user (protected)');
  console.log('  GET    /songs      - List songs (protected)');
  console.log('  GET    /songs/search?artist=NAME - Search by artist (protected)');
  console.log('  GET    /songs/:id  - Get song (protected)');
  console.log('  POST   /songs      - Create song (protected)');
  console.log('  PUT    /songs/:id  - Update song (protected)');
  console.log('  DELETE /songs/:id  - Delete song (protected)');
});

export default app;

import { createApp } from './app.js';
import { loadConfig } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './db/connection.js';

const config = await loadConfig();

try {
  await connectDatabase(config.db.uri, config.db.options);
  console.log(`[${config.env}] Connected to MongoDB`);
} catch (error) {
  console.error(`[${config.env}] Failed to connect to MongoDB: ${error.message}`);
  process.exit(1);
}

const server = createApp().listen(config.port, () => {
  console.log(`[${config.env}] Server listening on port ${config.port}`);
});

async function shutdown(signal) {
  console.log(`[${config.env}] ${signal} received, shutting down`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

import { createApp } from './app.js';
import { loadConfig } from './config/index.js';

const config = await loadConfig();

createApp().listen(config.port, () => {
  console.log(`[${config.env}] Server listening on port ${config.port}`);
});

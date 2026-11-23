import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ENVIRONMENTS = ['staging', 'preprod', 'prod'];

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Loads the configuration for the environment named by NODE_ENV.
 *
 * 1. Validates NODE_ENV against the supported environments.
 * 2. Loads `.env.<env>` (if present) into process.env for secrets.
 * 3. Dynamically imports `./env/<env>.js` for non-secret defaults.
 * 4. Lets environment variables (PORT, MONGODB_URI) override the defaults.
 */
export async function loadConfig(env = process.env.NODE_ENV ?? 'staging') {
  if (!ENVIRONMENTS.includes(env)) {
    throw new Error(`Unknown NODE_ENV "${env}". Expected one of: ${ENVIRONMENTS.join(', ')}`);
  }

  const envFile = path.join(ROOT_DIR, `.env.${env}`);
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }

  const { default: defaults } = await import(`./env/${env}.js`);

  const config = {
    ...defaults,
    port: Number(process.env.PORT ?? defaults.port),
    db: {
      ...defaults.db,
      uri: process.env.MONGODB_URI ?? defaults.db.uri,
    },
  };

  if (!config.db.uri) {
    throw new Error(`MONGODB_URI is required for the "${env}" environment`);
  }

  return Object.freeze(config);
}

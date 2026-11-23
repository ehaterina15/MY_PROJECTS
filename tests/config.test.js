import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config/index.js';

describe('loadConfig', () => {
  const originalUri = process.env.MONGODB_URI;

  afterEach(() => {
    if (originalUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalUri;
  });

  it('loads a distinct config for each environment', async () => {
    process.env.MONGODB_URI = 'mongodb://example/test';

    const configs = await Promise.all(['staging', 'preprod', 'prod'].map((env) => loadConfig(env)));

    assert.deepEqual(configs.map((c) => c.env), ['staging', 'preprod', 'prod']);
    assert.equal(new Set(configs.map((c) => c.port)).size, 3);
  });

  it('rejects an unknown environment', async () => {
    await assert.rejects(loadConfig('dev'), /Unknown NODE_ENV "dev"/);
  });

  it('requires MONGODB_URI in prod', async () => {
    delete process.env.MONGODB_URI;

    await assert.rejects(loadConfig('prod'), /MONGODB_URI is required/);
  });
});

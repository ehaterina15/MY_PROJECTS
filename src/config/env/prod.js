export default {
  env: 'prod',
  port: 3000,
  logLevel: 'warn',
  db: {
    // No default URI in production: MONGODB_URI must be provided by the environment.
    uri: undefined,
    options: { serverSelectionTimeoutMS: 10000, maxPoolSize: 20 },
  },
};

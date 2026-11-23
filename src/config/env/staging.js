export default {
  env: 'staging',
  port: 3001,
  logLevel: 'debug',
  db: {
    uri: 'mongodb://127.0.0.1:27017/tasks_staging',
    options: { serverSelectionTimeoutMS: 5000 },
  },
};

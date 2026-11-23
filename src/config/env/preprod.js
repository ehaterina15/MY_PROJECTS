export default {
  env: 'preprod',
  port: 3002,
  logLevel: 'info',
  db: {
    uri: 'mongodb://127.0.0.1:27017/tasks_preprod',
    options: { serverSelectionTimeoutMS: 5000 },
  },
};

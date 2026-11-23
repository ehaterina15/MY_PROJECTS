import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export async function connectDatabase(uri, options = {}) {
  await mongoose.connect(uri, options);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

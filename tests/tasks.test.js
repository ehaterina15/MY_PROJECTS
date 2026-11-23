import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/db/connection.js';
import { Task } from '../src/models/task.model.js';

describe('Tasks API', () => {
  let mongo;
  const app = createApp();

  before(async () => {
    mongo = await MongoMemoryServer.create();
    await connectDatabase(mongo.getUri());
  });

  after(async () => {
    await disconnectDatabase();
    await mongo.stop();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it('creates a task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Write tests' });

    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'Write tests');
    assert.equal(res.body.status, 'todo');
    assert.ok(res.body._id);
  });

  it('rejects a task without a title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'no title' });

    assert.equal(res.status, 400);
  });

  it('lists tasks and filters by status', async () => {
    await Task.create([{ title: 'A' }, { title: 'B', status: 'done' }]);

    const all = await request(app).get('/api/tasks');
    const done = await request(app).get('/api/tasks?status=done');

    assert.equal(all.body.length, 2);
    assert.deepEqual(done.body.map((t) => t.title), ['B']);
  });

  it('gets a task by id', async () => {
    const task = await Task.create({ title: 'Find me' });

    const res = await request(app).get(`/api/tasks/${task.id}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.title, 'Find me');
  });

  it('updates a task', async () => {
    const task = await Task.create({ title: 'Old' });

    const res = await request(app).patch(`/api/tasks/${task.id}`).send({ status: 'done' });

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'done');
  });

  it('rejects an invalid status on update', async () => {
    const task = await Task.create({ title: 'Task' });

    const res = await request(app).patch(`/api/tasks/${task.id}`).send({ status: 'nope' });

    assert.equal(res.status, 400);
  });

  it('deletes a task', async () => {
    const task = await Task.create({ title: 'Delete me' });

    const res = await request(app).delete(`/api/tasks/${task.id}`);

    assert.equal(res.status, 204);
    assert.equal(await Task.countDocuments(), 0);
  });

  it('returns 404 for unknown or malformed ids', async () => {
    const missing = await request(app).get('/api/tasks/507f1f77bcf86cd799439011');
    const malformed = await request(app).delete('/api/tasks/not-an-id');

    assert.equal(missing.status, 404);
    assert.equal(malformed.status, 404);
  });
});

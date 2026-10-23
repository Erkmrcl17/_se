
const request = require('supertest');

let app;

beforeEach(() => {
  jest.resetModules();
  app = require('../src/app');
});

describe('Todo API system tests', () => {
  test('GET /api/todos returns an empty list', async () => {
    const res = await request(app).get('/api/todos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Finish homework' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Finish homework');
    expect(res.body.completed).toBe(false);
  });

  test('POST rejects an empty title', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('PATCH marks a todo as completed', async () => {
    const created = await request(app)
      .post('/api/todos')
      .send({ title: 'Study' });

    const res = await request(app)
      .patch(`/api/todos/${created.body.id}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('DELETE removes a todo', async () => {
    const created = await request(app)
      .post('/api/todos')
      .send({ title: 'Read a book' });

    const res = await request(app)
      .delete(`/api/todos/${created.body.id}`);

    expect(res.status).toBe(204);

    const list = await request(app).get('/api/todos');
    expect(list.body).toEqual([]);
  });

  test('PATCH returns 404 for a missing todo', async () => {
    const res = await request(app)
      .patch('/api/todos/999')
      .send({ completed: true });

    expect(res.status).toBe(404);
  });
});

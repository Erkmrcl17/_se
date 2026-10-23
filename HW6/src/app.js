
const express = require('express');
const path = require('path');
const { validateTodo } = require('./todoUtils');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let todos = [];
let nextId = 1;

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (!validateTodo(title)) {
    return res.status(400).json({
      error: 'Title is required'
    });
  }

  const todo = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find(
    item => item.id === Number(req.params.id)
  );

  if (!todo) {
    return res.status(404).json({
      error: 'Todo not found'
    });
  }

  todo.completed = Boolean(req.body.completed);
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(
    item => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: 'Todo not found'
    });
  }

  todos.splice(index, 1);
  res.status(204).end();
});

module.exports = app;

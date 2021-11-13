const express = require('express');
const app = express();
const { Server } = require("socket.io");

const namespaces = require('./namespaces.json');

const expressServer = app.listen(3001);
const io = new Server(expressServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected to ${socket.nsp.name}`);

  socket.emit('namespaces', namespaces)
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', namespaceSocket => {
    console.log(`User ${namespaceSocket.id} connected to ${namespaceSocket.nsp.name}`);
    namespaceSocket.emit('rooms', namespace.rooms)
  })
})

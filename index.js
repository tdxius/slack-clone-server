const express = require('express');
const app = express();
const { Server } = require("socket.io");

const namespaces = require('./namespaces.json');

const findActiveRoom = (namespaceSocket, namespace) => {
  const roomSlug = Array.from(namespaceSocket.rooms)[1]
  return namespace.rooms.find(room => room.slug === roomSlug)
};

const expressServer = app.listen(3001);
const io = new Server(expressServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected to ${socket.nsp.name}`);

  socket.emit('load:namespaces', namespaces)
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', namespaceSocket => {
    console.log(`User ${namespaceSocket.id} connected to ${namespaceSocket.nsp.name}`);
    namespaceSocket.on('message', (message) => {
      console.log(`User ${namespaceSocket.id} in ${namespaceSocket.nsp.name} sent a message: ${message}`);
      const activeRoom = findActiveRoom(namespaceSocket, namespace)
      activeRoom.messages.push({
        user: 'Jaka',
        content: message,
      })
      io.of(namespace.endpoint).to(activeRoom.slug).emit('load:messages', activeRoom.messages)
    })
    namespaceSocket.on('room:join', (room) => {
      console.log(`User ${namespaceSocket.id} in ${namespaceSocket.nsp.name} joined a room: ${room.slug}`);
      const activeRoom = findActiveRoom(namespaceSocket, namespace)
      if (activeRoom) {
        namespaceSocket.leave(activeRoom.slug)
      }

      namespaceSocket.join(room.slug)
    })
    namespaceSocket.emit('load:rooms', namespace.rooms)
  })
})

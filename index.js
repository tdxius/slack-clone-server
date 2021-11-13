const express = require('express');
const app = express();
const { Server } = require("socket.io");

const namespaces = [
  {
    icon: 'mdi-briefcase',
    title: 'Work',
    endpoint: '/work',
    rooms: [
      {
        icon: 'mdi-briefcase',
        title: 'Work 1',
        slug: 'work-1',
      },
      {
        icon: 'mdi-briefcase',
        title: 'Work 2',
        slug: 'work-2',
      },
      {
        icon: 'mdi-briefcase',
        title: 'Work 2',
        slug: 'work-2',
      },
    ],
  },
  {
    icon: 'mdi-linux',
    title: 'Linux',
    endpoint: '/linux',
    rooms: [
      {
        icon: 'mdi-linux',
        title: 'Linux 1',
        slug: 'linux-1',
      },
      {
        icon: 'mdi-linux',
        title: 'Linux 2',
        slug: 'linux-2',
      },
    ],
  },
  {
    icon: 'mdi-human-male-female-child',
    title: 'Family',
    endpoint: '/family',
    rooms: [
      {
        icon: 'mdi-human-male-female-child',
        title: 'Family 1',
        slug: 'family-1',
      },
      {
        icon: 'mdi-human-male-female-child',
        title: 'Family 2',
        slug: 'family-2',
      },
    ],
  },
];

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

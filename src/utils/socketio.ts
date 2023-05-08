import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const socketConnection = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5174',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // console.log(`Socket ${socket.id} connected`);

    socket.on('addUser', (userId) => {
      console.log(`add user ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
};

export default socketConnection;

import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default function socketIo(server: any) {
  const io = new Server(server, {
    cors: {
      origin: [process.env.DOCTOR_URL, process.env.USER_URL, process.env.ADMIN_URL],
      methods: ['GET', 'POST'],
    },
  });

  let users = [];

  const addUser = (userId: mongoose.Types.ObjectId, socketId: string) => {
    const userExists = users.some((user) => user.userId === userId);
    if (!userExists) {
      users.push({ userId, socketId });
    }
  };

  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId: string) => {
    const user = users.find((data) => data.userId === userId);
    return user;
  };

  io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
      addUser(userId, socket.id);
    });

    io.emit('allUsers', users);

    socket.on('sendMessage', ({ senderId, recieverId, text }) => {
      const user = getUser(recieverId);
      io.to(user?.socketId).emit('getMessage', {
        senderId,
        text,
      });
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
    });
  });
}

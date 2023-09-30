import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import socket from './utils/socket.io/socketio.js';

//* Routers
import userRouter from './router/user.js';
import adminRouter from './router/admin.js';
import doctorRouter from './router/doctor.js';
import router from './router/router.js';
import conversationRouter from './router/conversation.js';
import messageRouter from './router/message.js';
import connection from './config/mongodbConnection.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(limiter);
dotenv.config();

/*
 *connect mongodb
 */
connection();

/*
 *Use Middlewares
 */
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  cors({
    origin: [
      process.env.DOCTOR_URL,
      process.env.USER_URL,
      process.env.ADMIN_URL,
    ],
  }),
);

/*
 *API Routes]
 */

app.use('/api', router);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);

/*
 *Start Server
 */

app.use((req, res) => {
  res.send('Hey thats a 404');
});

/*
 *socket io
 */

const server = http.createServer(app);

socket(server);

const port = process.env.PORT || 8080;
// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Server Started on http://localhost:${port}`));

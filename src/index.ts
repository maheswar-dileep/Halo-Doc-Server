import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from './router/userRouter.js';
import adminRouter from './router/adminRouter.js';
import doctorRouter from './router/doctorRouter.js';
import router from './router/router.js';
import connection from './config/mongodbConnection.js';

const app = express();
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
app.use(morgan('tiny'));
app.use(cors());

/*
 *API Routes]
 */

app.use('/api', router);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);

/*
 *Start Server
 */

app.use((req, res) => {
  res.send('Hey thats a 404');
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Started on http://localhost:${port}`));

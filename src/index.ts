import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser'
import userRouter from './router/userRouter.js'
import adminRouter from './router/adminRouter.js'

const app = express();
dotenv.config();

/*
*connect mongodb 
*/
import connection from "./model/connection/config.js";
connection();

/*
 *Use Middlewares
 */
app.use(express.json());
app.use(cookieParser())
app.use(morgan("tiny"));
app.use(cors());

/*
 *API Routes]
 */

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

/*
 *Start Server
 */

app.use((req, res) => {
  res.send("Hey thats a 404");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Started on http://localhost:${port}`));

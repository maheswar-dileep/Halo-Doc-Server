import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRouter from './router/userRouter.js'

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
app.use(morgan("tiny"));
app.use(cors());

/*
 *API Routes
 TODO:Import User Router 
 */

app.use("/api/user",userRouter);

/*
 *Start Server
 */

app.use((req, res) => {
  res.send("Hey thats a 404");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Started on http://localhost:${port}`));

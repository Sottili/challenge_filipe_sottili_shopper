import express from "express";
import dotenv from "dotenv";
import { db } from "./services/database";

dotenv.config();

const database = new db();
/*database.initialize();*/

const app = express();
const port = 81;

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});

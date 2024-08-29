// Import do Express
import express from "express";

// Rotas da aplicação
import router from "./router";

// Import e configuração dos arquivos .env
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Porta da Aplicação
const port = 80;

//Json
app.use(express.json());

// Routes
app.use("/", router);

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/*
  Configuração da porta do servidor.
  Se existir uma porta no ficheiro .env, usamos essa porta.
  Caso contrário, usamos a porta 3000.
*/
app.set("port", process.env.PORT || 3000);

/*
  Middlewares principais da aplicação.
  O cors permite a comunicação entre frontend e backend.
  O express.json permite receber dados em formato JSON.
*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
  Rota inicial para testar se a API está a funcionar.
*/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API StyleMarket a funcionar",
  });
});

/*
  Arranque do servidor.
*/
app.listen(app.get("port"), () => {
  console.log("Servidor iniciado na porta " + app.get("port"));
});
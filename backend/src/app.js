const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");

const app = express();

/* Porta do servidor */
app.set("port", process.env.PORT || 3000);

/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Rota de teste */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API StyleMarket a funcionar",
  });
});

/* Rotas */
const categoriaRoutes = require("./routes/categoriaRoute");

app.use("/categorias", categoriaRoutes);

/* Liga à base de dados e inicia o servidor */
sequelize
  .sync()
  .then(() => {
    console.log("Base de dados sincronizada com sucesso.");

    app.listen(app.get("port"), () => {
      console.log("Servidor iniciado na porta " + app.get("port"));
    });
  })
  .catch((error) => {
    console.log("Erro ao sincronizar a base de dados:", error);
  });
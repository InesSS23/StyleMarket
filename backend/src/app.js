const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const verificarDadosIniciais = require("./config/dadosIniciais");

const categoriaRoutes = require("./routes/categoriaRoute");
const produtoRoutes = require("./routes/produtoRoute");
const encomendaRoutes = require("./routes/encomendaRoute");
const userRoutes = require("./routes/userRoute");
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoute");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true, limit: "60mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API StyleMarket a funcionar",
  });
});

app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/encomendas", encomendaRoutes);
app.use("/utilizadores", userRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada.",
  });
});

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Base de dados sincronizada com sucesso.");

    if (process.env.CRIAR_DADOS_INICIAIS !== "false") {
      await verificarDadosIniciais();
      console.log("Dados iniciais verificados/criados.");
    }

    app.listen(app.get("port"), () => {
      console.log("Servidor iniciado na porta " + app.get("port"));
    });
  })
  .catch((error) => {
    console.log("Erro ao sincronizar a base de dados:", error);
  });

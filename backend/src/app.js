const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, User, Category } = require("./models");

const app = express();

/* Porta do servidor */
app.set("port", process.env.PORT || 3000);

/* Middlewares */
app.use(cors());

app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true, limit: "60mb" }));

/* Rota de teste */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API StyleMarket a funcionar",
  });
});

/* Rotas */
const categoriaRoutes = require("./routes/categoriaRoute");
const produtoRoutes = require("./routes/produtoRoute");
const encomendaRoutes = require("./routes/encomendaRoute");
const authRoutes = require("./routes/authRoute");

app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/encomendas", encomendaRoutes);
app.use("/auth", authRoutes);

/* Liga à base de dados e inicia o servidor */
sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Base de dados sincronizada com sucesso.");

    const defaultCategories = [
      "T-shirts",
      "Casacos",
      "Calças",
      "Vestidos",
      "Sapatilhas",
      "Acessórios",
    ];

    for (const categoryName of defaultCategories) {
      await Category.findOrCreate({
        where: { name: categoryName },
        defaults: { name: categoryName },
      });
    }

    //CONTAS PADRÃO PARA TESTES COMPRADOR, VENDEDOR E ADMIN (REMOVER DEPOIS)
    await User.findOrCreate({
      where: { email: "vendedor@stylemarket.com" },
      defaults: {
        name: "Vendedor Padrão",
        email: "vendedor@stylemarket.com",
        password: "1234",
        role: "vendedor",
        storeName: "Loja Padrão",
      },
    });

    await User.findOrCreate({
      where: { email: "comprador@stylemarket.com" },
      defaults: {
        name: "Comprador Padrão",
        email: "comprador@stylemarket.com",
        password: "1234",
        role: "comprador",
      },
    });

    await User.findOrCreate({
      where: { email: "admin@stylemarket.com" },
      defaults: {
        name: "Administrador",
        email: "admin@stylemarket.com",
        password: "1234",
        role: "admin",
      },
    });

    console.log("Dados iniciais verificados/criados.");

    app.listen(app.get("port"), () => {
      console.log("Servidor iniciado na porta " + app.get("port"));
    });
  })
  .catch((error) => {
    console.log("Erro ao sincronizar a base de dados:", error);
  });
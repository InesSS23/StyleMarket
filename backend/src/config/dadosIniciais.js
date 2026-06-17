const { Category, User } = require("../models");

const CATEGORIAS_INICIAIS = [
  "T-shirts",
  "Camisolas",
  "Blusas",
  "Casacos",
  "Calças",
  "Saias",
  "Vestidos",
  "Conjuntos",
  "Sapatilhas",
  "Acessórios",
];

const UTILIZADORES_INICIAIS = [
  {
    name: "Vendedor Padrão",
    email: "vendedor@s.com",
    password: "1234",
    role: "vendedor",
    storeName: "Loja Padrão",
  },
  {
    name: "Comprador Padrão",
    email: "comprador@s.com",
    password: "1234",
    role: "comprador",
  },
  {
    name: "Administrador",
    email: "admin@s.com",
    password: "1234",
    role: "admin",
  },
];

async function verificarDadosIniciais() {
  for (const nome of CATEGORIAS_INICIAIS) {
    await Category.findOrCreate({
      where: {
        name: nome,
      },
      defaults: {
        name: nome,
      },
    });
  }

  for (const utilizador of UTILIZADORES_INICIAIS) {
    await User.findOrCreate({
      where: {
        email: utilizador.email,
      },
      defaults: utilizador,
    });
  }
}

module.exports = verificarDadosIniciais;
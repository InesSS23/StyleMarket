const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("order", {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  status: {
    type: DataTypes.ENUM("Pendente", "Paga", "Enviada", "Concluída", "Cancelada"),
    allowNull: false,
    defaultValue: "Pendente",
  },
});

module.exports = Order;
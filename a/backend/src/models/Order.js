const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("order", {
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  shipping: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

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
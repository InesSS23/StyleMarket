const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

  condition: {
    type: DataTypes.ENUM("Novo", "Usado - Como Novo", "Usado - Bom Estado"),
    allowNull: false,
    defaultValue: "Novo",
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Product;
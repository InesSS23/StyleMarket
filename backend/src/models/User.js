const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("comprador", "vendedor", "admin"),
    allowNull: false,
    defaultValue: "comprador",
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  storeName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  storeDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  storeContact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;
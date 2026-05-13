const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("orderItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = OrderItem;
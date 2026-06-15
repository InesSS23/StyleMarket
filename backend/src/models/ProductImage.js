const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductImage = sequelize.define(
  "ProductImage",
  {
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    isCover: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "productImages",
  }
);

module.exports = ProductImage;
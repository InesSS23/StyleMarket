const sequelize = require("../config/database");

const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const ProductVariant = require("./ProductVariant");
const ProductImage = require("./ProductImage");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

User.hasMany(Product, {
  foreignKey: "sellerId",
});

Product.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
});

Product.hasMany(ProductVariant, {
  foreignKey: "productId",
});

ProductVariant.belongsTo(Product, {
  foreignKey: "productId",
});

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "productImages",
  onDelete: "CASCADE",
});

ProductImage.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

User.hasMany(Order, {
  foreignKey: "buyerId",
});

Order.belongsTo(User, {
  foreignKey: "buyerId",
  as: "buyer",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

ProductVariant.hasMany(OrderItem, {
  foreignKey: "productVariantId",
});

OrderItem.belongsTo(ProductVariant, {
  foreignKey: "productVariantId",
});

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  Order,
  OrderItem,
};
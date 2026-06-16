const { QueryTypes } = require("sequelize");
const { sequelize, User, Product, Order } = require("../models");

const controllers = {};

controllers.stats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalVendedores = await User.count({ where: { role: "vendedor" } });
    const totalOrders = await Order.count();
    const totalRevenue = Number((await Order.sum("total")) || 0);

    const tableName = Order.getTableName();
    const monthlyRevenue = await sequelize.query(
      `SELECT date_trunc('month', "createdAt") AS month, SUM("total") AS revenue
       FROM "${tableName}"
       GROUP BY month
       ORDER BY month ASC
       LIMIT 12`,
      { type: QueryTypes.SELECT }
    );

    const revenueByMonth = monthlyRevenue.reduce((acc, item) => {
      const monthDate = item.month instanceof Date ? item.month : new Date(item.month);
      const monthKey = `${monthDate.getUTCFullYear()}-${String(
        monthDate.getUTCMonth() + 1
      ).padStart(2, "0")}`;
      acc[monthKey] = Number(item.revenue);
      return acc;
    }, {});

    const now = new Date();
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const monthOffset = now.getMonth() - 11 + index;
      const year = now.getFullYear() + Math.floor(monthOffset / 12);
      const month = ((monthOffset % 12) + 12) % 12;
      const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
      return {
        month: monthKey,
        revenue: revenueByMonth[monthKey] || 0,
      };
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalVendedores,
        totalOrders,
        totalRevenue,
        monthlyRevenue: monthlyData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter estatísticas do dashboard.",
      error: error.message,
    });
  }
};

module.exports = controllers;

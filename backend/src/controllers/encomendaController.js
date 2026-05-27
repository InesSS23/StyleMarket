const { Order, OrderItem, Product, User, Category } = require("../models");

const controllers = {};

/* Listar encomendas */
controllers.listar = async (req, res) => {
  try {
    const data = await Order.findAll({
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "name", "email"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Category,
                },
                {
                  model: User,
                  as: "seller",
                  attributes: ["id", "name", "storeName"],
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar encomendas.",
      error: error.message,
    });
  }
};

/* Listar encomendas de um vendedor */
controllers.listarPorVendedor = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "name", "email"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Category,
                },
                {
                  model: User,
                  as: "seller",
                  attributes: ["id", "name", "storeName"],
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    const data = orders
      .map((order) => {
        const sellerItems = order.orderItems.filter(
          (item) => item.product && item.product.sellerId === Number(sellerId)
        );

        if (sellerItems.length === 0) {
          return null;
        }

        return {
          ...order.toJSON(),
          orderItems: sellerItems,
        };
      })
      .filter(Boolean);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar encomendas do vendedor.",
      error: error.message,
    });
  }
};

module.exports = controllers;

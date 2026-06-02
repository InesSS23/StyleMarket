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

/* Criar encomenda */
controllers.criar = async (req, res) => {
  try {
    const { customer, paymentMethod, items } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Dados da encomenda incompletos.",
      });
    }

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.postalCode ||
      !customer.city
    ) {
      return res.status(400).json({
        success: false,
        message: "Preenche todos os dados do comprador.",
      });
    }

    let subtotal = 0;
    const itensValidos = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Produto não encontrado.",
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantidade inválida.",
        });
      }

      subtotal += Number(product.price) * quantity;

      itensValidos.push({
        product,
        quantity,
        price: Number(product.price),
      });
    }

    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const order = await Order.create({
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      address: customer.address,
      postalCode: customer.postalCode,
      city: customer.city,
      paymentMethod,
      subtotal,
      shipping,
      total,
      status: "Pendente",
      buyerId: customer.buyerId || null,
    });

    for (const item of itensValidos) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    const encomendaCriada = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [Category],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Encomenda criada com sucesso.",
      data: encomendaCriada,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar encomenda.",
      error: error.message,
    });
  }
};

/* Obter encomenda por id */
controllers.obter = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [Category],
            },
          ],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Encomenda não encontrada.",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter encomenda.",
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
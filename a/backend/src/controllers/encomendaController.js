const {
  sequelize,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  User,
  Category,
} = require("../models");

const controllers = {};

function criarErro(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

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
            {
              model: ProductVariant,
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

/* Criar encomenda e descontar stock */
controllers.criar = async (req, res) => {
  let transaction = null;

  try {
    const { customer, paymentMethod, items } = req.body;

    if (!customer || !Array.isArray(items) || items.length === 0) {
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

    transaction = await sequelize.transaction();

    let subtotal = 0;
    const itensValidos = [];

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw criarErro(400, "Quantidade inválida.");
      }

      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw criarErro(404, "Produto não encontrado.");
      }

      const variantes = await ProductVariant.findAll({
        where: { productId: product.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
        order: [["id", "ASC"]],
      });

      let variant = null;

      if (item.productVariantId) {
        variant = variantes.find(
          (opcao) => opcao.id === Number(item.productVariantId)
        );
      } else if (variantes.length === 1) {
        variant = variantes[0];
      }

      if (variantes.length > 1 && !variant) {
        throw criarErro(
          400,
          `Seleciona uma opção válida para ${product.name}.`
        );
      }

      const stockDisponivel = variant
        ? Number(variant.stock || 0)
        : Number(product.stock || 0);

      if (stockDisponivel <= 0) {
        throw criarErro(400, `${product.name} está esgotado.`);
      }

      if (stockDisponivel < quantity) {
        const detalheVariante = variant
          ? ` (${variant.color}, ${variant.size})`
          : "";

        throw criarErro(
          400,
          `Stock insuficiente para ${product.name}${detalheVariante}. Só existem ${stockDisponivel} unidade(s).`
        );
      }

      subtotal += Number(product.price) * quantity;

      itensValidos.push({
        product,
        variant,
        quantity,
        price: Number(product.price),
      });
    }

    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const order = await Order.create(
      {
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
      },
      { transaction }
    );

    for (const item of itensValidos) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.product.id,
          productVariantId: item.variant ? item.variant.id : null,
          quantity: item.quantity,
          price: item.price,
        },
        { transaction }
      );

      if (item.variant) {
        await item.variant.update(
          {
            stock: Number(item.variant.stock) - item.quantity,
          },
          { transaction }
        );

        const stockTotal = await ProductVariant.sum("stock", {
          where: { productId: item.product.id },
          transaction,
        });

        await item.product.update(
          {
            stock: Number(stockTotal || 0),
          },
          { transaction }
        );
      } else {
        await item.product.update(
          {
            stock: Number(item.product.stock) - item.quantity,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    transaction = null;

    const encomendaCriada = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [Category],
            },
            {
              model: ProductVariant,
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
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    res.status(error.status || 500).json({
      success: false,
      message: error.status
        ? error.message
        : "Erro ao criar encomenda.",
      error: error.status ? undefined : error.message,
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
            {
              model: ProductVariant,
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
            {
              model: ProductVariant,
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

const { Product, ProductVariant, Category, User } = require("../models");

const controllers = {};

/* Listar produtos */
controllers.listar = async (req, res) => {
  try {
    const data = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "name", "email", "storeName"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar produtos.",
      error: error.message,
    });
  }
};

/* Listar produtos do vendedor */
controllers.listarPorVendedor = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const data = await Product.findAll({
      where: { sellerId },
      include: [
        {
          model: Category,
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "name", "email", "storeName"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar produtos do vendedor.",
      error: error.message,
    });
  }
};

/* Criar produto */
controllers.criar = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      size,
      color,
      brand,
      stock,
      condition,
      image,
      categoryId,
      sellerId,
      variants,
    } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Preenche os campos obrigatórios do produto.",
      });
    }

    const data = await Product.create({
      name,
      description,
      price,
      size: size || "Único",
      color: color || "Única",
      brand,
      stock: stock || 0,
      condition,
      image,
      categoryId,
      sellerId,
    });

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (variant.size && variant.color) {
          await ProductVariant.create({
            productId: data.id,
            size: variant.size,
            color: variant.color,
            stock: variant.stock || 0,
          });
        }
      }
    } else {
      await ProductVariant.create({
        productId: data.id,
        size: size || "Único",
        color: color || "Única",
        stock: stock || 0,
      });
    }

    const produtoCriado = await Product.findByPk(data.id, {
      include: [Category, ProductVariant],
    });

    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso.",
      data: produtoCriado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar produto.",
      error: error.message,
    });
  }
};

/* Obter produto por id */
controllers.obter = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Product.findByPk(id, {
      include: [
        {
          model: Category,
        },
        {
          model: ProductVariant,
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "name", "email", "storeName"],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter produto.",
      error: error.message,
    });
  }
};

/* Atualizar produto */
controllers.atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Product.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    await produto.update(req.body);

    res.json({
      success: true,
      message: "Produto atualizado com sucesso.",
      data: produto,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar produto.",
      error: error.message,
    });
  }
};

/* Apagar produto */
controllers.apagar = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.destroy({
      where: { id: id },
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    res.json({
      success: true,
      message: "Produto removido com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao remover produto.",
      error: error.message,
    });
  }
};

//ROTA TEMPORARIA VARIANTES
controllers.criarVariantesAntigas = async (req, res) => {
  try {
    const produtos = await Product.findAll({
      include: [ProductVariant],
    });

    let totalCriadas = 0;

    for (const produto of produtos) {
      if (!produto.productVariants || produto.productVariants.length === 0) {
        await ProductVariant.create({
          productId: produto.id,
          size: produto.size || "Único",
          color: produto.color || "Única",
          stock: produto.stock || 0,
        });

        totalCriadas++;
      }
    }

    res.json({
      success: true,
      message: "Variações antigas verificadas.",
      totalCriadas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar variações antigas.",
      error: error.message,
    });
  }
};
module.exports = controllers;
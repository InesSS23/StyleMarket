const { Product, Category, User } = require("../models");

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
    } = req.body;

    if (!name || !description || !price || !size || !color) {
      return res.status(400).json({
        success: false,
        message: "Preenche os campos obrigatórios do produto.",
      });
    }

    const data = await Product.create({
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
    });

    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso.",
      data: data,
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

module.exports = controllers;
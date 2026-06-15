const { Category } = require("../models");

const controllers = {};

/* Listar categorias */
controllers.listar = async (req, res) => {
  try {
    const data = await Category.findAll({
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar categorias.",
      error: error.message,
    });
  }
};

/* Criar categoria */
controllers.criar = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "O nome da categoria é obrigatório.",
      });
    }

    const data = await Category.create({
      name: name,
    });

    res.status(201).json({
      success: true,
      message: "Categoria criada com sucesso.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar categoria.",
      error: error.message,
    });
  }
};

/* Obter categoria por id */
controllers.obter = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Category.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada.",
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter categoria.",
      error: error.message,
    });
  }
};

/* Atualizar categoria */
controllers.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada.",
      });
    }

    await category.update({
      name: name,
    });

    res.json({
      success: true,
      message: "Categoria atualizada com sucesso.",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar categoria.",
      error: error.message,
    });
  }
};

/* Apagar categoria */
controllers.apagar = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.destroy({
      where: { id: id },
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada.",
      });
    }

    res.json({
      success: true,
      message: "Categoria removida com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao remover categoria.",
      error: error.message,
    });
  }
};

module.exports = controllers;
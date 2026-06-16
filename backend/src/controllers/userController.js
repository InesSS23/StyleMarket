const { User } = require("../models");

const controllers = {};

/* Listar utilizadores */
controllers.listar = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "storeName",
        "storeDescription",
        "storeContact",
        "createdAt",
      ],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar utilizadores.",
      error: error.message,
    });
  }
};

module.exports = controllers;

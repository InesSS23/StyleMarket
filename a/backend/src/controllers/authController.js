const { User } = require("../models");

const controllers = {};

/* Registar comprador ou vendedor */
controllers.registar = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      storeName,
      storeDescription,
      storeContact,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Preenche nome, email e password.",
      });
    }

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Não é permitido registar administradores.",
      });
    }

    const roleFinal =
      role === "vendedor" ? "vendedor" : "comprador";

    if (
      roleFinal === "vendedor" &&
      (!storeName || !storeName.trim())
    ) {
      return res.status(400).json({
        success: false,
        message:
          "O nome público do vendedor ou da loja é obrigatório.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const emailExistente = await User.findOne({
      where: {
        email: emailNormalizado,
      },
    });

    if (emailExistente) {
      return res.status(400).json({
        success: false,
        message: "Já existe uma conta com este email.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: emailNormalizado,
      password,
      role: roleFinal,
      storeName:
        roleFinal === "vendedor" ? storeName.trim() : null,
      storeDescription:
        roleFinal === "vendedor"
          ? storeDescription?.trim() || null
          : null,
      storeContact:
        roleFinal === "vendedor"
          ? storeContact?.trim() || null
          : null,
    });

    res.status(201).json({
      success: true,
      message: "Conta criada com sucesso.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        storeDescription: user.storeDescription,
        storeContact: user.storeContact,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar conta.",
      error: error.message,
    });
  }
};

/* Login único */
controllers.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Preenche email e password.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const user = await User.findOne({
      where: {
        email: emailNormalizado,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Não existe nenhuma conta com este email.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Password incorreta.",
      });
    }

    res.json({
      success: true,
      message: "Login efetuado com sucesso.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        storeDescription: user.storeDescription,
        storeContact: user.storeContact,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao iniciar sessão.",
      error: error.message,
    });
  }
};

module.exports = controllers;
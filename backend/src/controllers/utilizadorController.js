const { Op } = require("sequelize");
const { User } = require("../models");

const controllers = {};

const PERFIS_VALIDOS = ["comprador", "vendedor", "admin"];

function dadosPublicosUtilizador(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    storeName: user.storeName,
    storeDescription: user.storeDescription,
    storeContact: user.storeContact,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

controllers.listar = async (req, res) => {
  try {
    const pesquisa = req.query.pesquisa?.trim() || "";
    const role = req.query.role?.trim() || "";

    const where = {};

    if (pesquisa) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          storeName: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ];
    }

    if (PERFIS_VALIDOS.includes(role)) {
      where.role = role;
    }

    const utilizadores = await User.findAll({
      where,
      attributes: {
        exclude: ["password"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: utilizadores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao carregar utilizadores.",
      error: error.message,
    });
  }
};

controllers.obter = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!utilizador) {
      return res.status(404).json({
        success: false,
        message: "Utilizador não encontrado.",
      });
    }

    res.json({
      success: true,
      data: utilizador,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao carregar utilizador.",
      error: error.message,
    });
  }
};

controllers.atualizar = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({
        success: false,
        message: "Utilizador não encontrado.",
      });
    }

    const {
      name,
      email,
      role,
      storeName,
      storeDescription,
      storeContact,
    } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "O nome e o email são obrigatórios.",
      });
    }

    const roleFinal = PERFIS_VALIDOS.includes(role)
      ? role
      : utilizador.role;

    if (utilizador.role === "admin" && roleFinal !== "admin") {
      return res.status(403).json({
        success: false,
        message: "O perfil do administrador principal não pode ser alterado.",
      });
    }

    if (roleFinal === "vendedor" && !storeName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "O nome público do vendedor ou da loja é obrigatório.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const emailExistente = await User.findOne({
      where: {
        email: emailNormalizado,
        id: {
          [Op.ne]: utilizador.id,
        },
      },
    });

    if (emailExistente) {
      return res.status(400).json({
        success: false,
        message: "Já existe uma conta com este email.",
      });
    }

    utilizador.name = name.trim();
    utilizador.email = emailNormalizado;
    utilizador.role = roleFinal;
    utilizador.storeName =
      roleFinal === "vendedor" ? storeName.trim() : null;
    utilizador.storeDescription =
      roleFinal === "vendedor"
        ? storeDescription?.trim() || null
        : null;
    utilizador.storeContact =
      roleFinal === "vendedor"
        ? storeContact?.trim() || null
        : null;

    await utilizador.save();

    res.json({
      success: true,
      message: "Utilizador atualizado com sucesso.",
      data: dadosPublicosUtilizador(utilizador),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar utilizador.",
      error: error.message,
    });
  }
};

controllers.alterarEstado = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({
        success: false,
        message: "Utilizador não encontrado.",
      });
    }

    if (utilizador.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "A conta de administrador não pode ser desativada.",
      });
    }

    utilizador.isActive = !utilizador.isActive;
    await utilizador.save();

    res.json({
      success: true,
      message: utilizador.isActive
        ? "Utilizador ativado com sucesso."
        : "Utilizador desativado com sucesso.",
      data: dadosPublicosUtilizador(utilizador),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao alterar o estado do utilizador.",
      error: error.message,
    });
  }
};

controllers.apagar = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({
        success: false,
        message: "Utilizador não encontrado.",
      });
    }

    if (utilizador.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "A conta de administrador não pode ser apagada.",
      });
    }

    await utilizador.destroy();

    res.json({
      success: true,
      message: "Utilizador apagado com sucesso.",
    });
  } catch (error) {
    const mensagem =
      error.name === "SequelizeForeignKeyConstraintError"
        ? "Este utilizador não pode ser apagado porque tem produtos ou encomendas associados."
        : "Erro ao apagar utilizador.";

    res.status(
      error.name === "SequelizeForeignKeyConstraintError" ? 409 : 500
    ).json({
      success: false,
      message: mensagem,
      error: error.message,
    });
  }
};

module.exports = controllers;
const { Product, ProductVariant, Category, User } = require("../models");

const controllers = {};

const includeProduto = [
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
];

/* Listar produtos */
controllers.listar = async (req, res) => {
  try {
    const data = await Product.findAll({
      include: includeProduto,
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      data,
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
      include: includeProduto,
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      data,
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

    const stockInicial = Math.max(0, Number(stock) || 0);

    const data = await Product.create({
      name,
      description,
      price: Number(price),
      size: size || "Único",
      color: color || "Única",
      brand,
      stock: stockInicial,
      condition,
      image,
      categoryId,
      sellerId,
    });

    if (Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        if (variant.size && variant.color) {
          await ProductVariant.create({
            productId: data.id,
            size: variant.size,
            color: variant.color,
            stock: Math.max(0, Number(variant.stock) || 0),
          });
        }
      }
    } else {
      await ProductVariant.create({
        productId: data.id,
        size: size || "Único",
        color: color || "Única",
        stock: stockInicial,
      });
    }

    const stockTotal = await ProductVariant.sum("stock", {
      where: { productId: data.id },
    });

    await data.update({
      stock: Number(stockTotal || 0),
    });

    const produtoCriado = await Product.findByPk(data.id, {
      include: includeProduto,
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
      include: includeProduto,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    res.json({
      success: true,
      data,
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
    const { variants, ...dadosProduto } = req.body;

    const produto = await Product.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    if (dadosProduto.price !== undefined) {
      dadosProduto.price = Number(dadosProduto.price);
    }

    if (dadosProduto.categoryId !== undefined) {
      dadosProduto.categoryId = Number(dadosProduto.categoryId);
    }

    await produto.update(dadosProduto);

    const variantesAtuais = await ProductVariant.findAll({
      where: { productId: produto.id },
      order: [["id", "ASC"]],
    });

    if (Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        if (variant.id) {
          const varianteExistente = await ProductVariant.findOne({
            where: {
              id: variant.id,
              productId: produto.id,
            },
          });

          if (varianteExistente) {
            await varianteExistente.update({
              size: variant.size,
              color: variant.color,
              stock: Math.max(0, Number(variant.stock) || 0),
            });
          }
        } else if (variant.size && variant.color) {
          await ProductVariant.create({
            productId: produto.id,
            size: variant.size,
            color: variant.color,
            stock: Math.max(0, Number(variant.stock) || 0),
          });
        }
      }
    } else if (variantesAtuais.length <= 1) {
      const dadosVariante = {
        size: dadosProduto.size || produto.size || "Único",
        color: dadosProduto.color || produto.color || "Única",
        stock: Math.max(0, Number(dadosProduto.stock) || 0),
      };

      if (variantesAtuais.length === 1) {
        await variantesAtuais[0].update(dadosVariante);
      } else {
        await ProductVariant.create({
          productId: produto.id,
          ...dadosVariante,
        });
      }
    }

    const stockTotal = await ProductVariant.sum("stock", {
      where: { productId: produto.id },
    });

    await produto.update({
      stock: Number(stockTotal || 0),
    });

    const produtoAtualizado = await Product.findByPk(produto.id, {
      include: includeProduto,
    });

    res.json({
      success: true,
      message: "Produto atualizado com sucesso.",
      data: produtoAtualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar produto.",
      error: error.message,
    });
  }
};

/* Verificar stock dos itens do carrinho */
controllers.verificarStock = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Os itens do carrinho são inválidos.",
      });
    }

    const resultados = [];

    for (const item of items) {
      const quantidade = Number(item.quantity);

      const produto = await Product.findByPk(item.productId, {
        include: [ProductVariant],
      });

      if (!produto) {
        resultados.push({
          cartKey: item.cartKey,
          productId: item.productId,
          productVariantId: item.productVariantId || null,
          stockDisponivel: 0,
          esgotado: true,
          quantidadeValida: false,
          disponivel: false,
          message: "Este produto já não está disponível.",
        });
        continue;
      }

      const variantes = produto.productVariants || [];
      let variante = null;

      if (item.productVariantId) {
        variante = variantes.find(
          (opcao) => opcao.id === Number(item.productVariantId)
        );
      } else if (variantes.length === 1) {
        variante = variantes[0];
      }

      if (variantes.length > 1 && !variante) {
        resultados.push({
          cartKey: item.cartKey,
          productId: produto.id,
          productVariantId: null,
          stockDisponivel: 0,
          esgotado: false,
          quantidadeValida: false,
          disponivel: false,
          message: "A opção escolhida deste produto já não é válida.",
        });
        continue;
      }

      const stockDisponivel = variante
        ? Number(variante.stock || 0)
        : Number(produto.stock || 0);

      const esgotado = stockDisponivel <= 0;
      const quantidadeValida =
        quantidade >= 1 && quantidade <= stockDisponivel;

      let message = "Stock disponível.";

      if (esgotado) {
        message = "Produto esgotado. Remove-o do carrinho para continuar.";
      } else if (!quantidadeValida) {
        message = `Só existem ${stockDisponivel} unidade(s) disponíveis.`;
      }

      resultados.push({
        cartKey: item.cartKey,
        productId: produto.id,
        productVariantId: variante ? variante.id : null,
        stockDisponivel,
        esgotado,
        quantidadeValida,
        disponivel: !esgotado && quantidadeValida,
        message,
      });
    }

    res.json({
      success: true,
      carrinhoValido: resultados.every((item) => item.disponivel),
      data: resultados,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao verificar o stock do carrinho.",
      error: error.message,
    });
  }
};

/* Apagar produto */
controllers.apagar = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.destroy({
      where: { id },
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

/* Rota temporária para produtos antigos */
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

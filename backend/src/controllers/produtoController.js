const {
  sequelize,
  Product,
  ProductVariant,
  ProductImage,
  OrderItem,
  Category,
  User,
} = require("../models");

const controllers = {};

/*
  Nas listagens é enviada apenas a imagem de capa de cada produto.
  As restantes imagens só são carregadas quando se abre a página de detalhes.
  Isto reduz bastante a transferência de dados da base online.
*/
const includeProdutoResumo = [
  {
    model: Category,
    attributes: ["id", "name"],
  },
  {
    model: ProductVariant,
    separate: true,
    order: [["id", "ASC"]],
  },
  {
    model: ProductImage,
    as: "productImages",
    attributes: ["id", "image", "position", "isCover", "productId"],
    separate: true,
    limit: 1,
    order: [
      ["isCover", "DESC"],
      ["position", "ASC"],
      ["id", "ASC"],
    ],
  },
  {
    model: User,
    as: "seller",
    attributes: ["id", "name", "email", "storeName"],
  },
];

/*
  A versão completa é usada apenas na criação, edição e detalhes do produto,
  onde são realmente necessárias todas as imagens.
*/
const includeProdutoCompleto = [
  {
    model: Category,
  },
  {
    model: ProductVariant,
    separate: true,
    order: [["id", "ASC"]],
  },
  {
    model: ProductImage,
    as: "productImages",
    separate: true,
    order: [
      ["position", "ASC"],
      ["id", "ASC"],
    ],
  },
  {
    model: User,
    as: "seller",
    attributes: ["id", "name", "email", "storeName"],
  },
];

function criarErro(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function prepararVariantes(variants, fallback = {}) {
  let variantesRecebidas = [];

  if (Array.isArray(variants) && variants.length > 0) {
    variantesRecebidas = variants;
  } else {
    variantesRecebidas = [
      {
        size: fallback.size || "Único",
        color: fallback.color || "Única",
        stock: fallback.stock || 0,
      },
    ];
  }

  const variantesPreparadas = variantesRecebidas.map((variant) => {
    const stock = Number(variant.stock);

    return {
      id: variant.id ? Number(variant.id) : null,
      size: String(variant.size || "").trim(),
      color: String(variant.color || "").trim(),
      stock,
    };
  });

  const temCamposVazios = variantesPreparadas.some(
    (variant) => !variant.size || !variant.color
  );

  if (temCamposVazios) {
    throw criarErro(400, "Preenche o tamanho e a cor de todas as opções.");
  }

  const temStockInvalido = variantesPreparadas.some(
    (variant) => !Number.isInteger(variant.stock) || variant.stock < 0
  );

  if (temStockInvalido) {
    throw criarErro(
      400,
      "O stock de cada opção deve ser um número inteiro igual ou superior a 0."
    );
  }

  const combinacoes = variantesPreparadas.map(
    (variant) => `${variant.size.toLowerCase()}|${variant.color.toLowerCase()}`
  );

  if (new Set(combinacoes).size !== combinacoes.length) {
    throw criarErro(
      400,
      "Não podes repetir a mesma combinação de tamanho e cor."
    );
  }

  return variantesPreparadas;
}

function prepararImagens(images, imagemAntiga = null) {
  let imagensRecebidas = [];

  if (Array.isArray(images)) {
    imagensRecebidas = images;
  } else if (imagemAntiga) {
    imagensRecebidas = [imagemAntiga];
  }

  if (imagensRecebidas.length > 6) {
    throw criarErro(400, "Podes adicionar no máximo 6 imagens por produto.");
  }

  return imagensRecebidas
    .map((item, index) => {
      const valor = typeof item === "string" ? item : item?.image;

      return {
        image: typeof valor === "string" ? valor.trim() : "",
        position: index,
        isCover: index === 0,
      };
    })
    .filter((item) => item.image);
}

async function criarImagensProduto(productId, imagensPreparadas, transaction) {
  for (const imagem of imagensPreparadas) {
    await ProductImage.create(
      {
        productId,
        image: imagem.image,
        position: imagem.position,
        isCover: imagem.isCover,
      },
      { transaction }
    );
  }
}

async function substituirImagensProduto(
  productId,
  imagensPreparadas,
  transaction
) {
  await ProductImage.destroy({
    where: { productId },
    transaction,
  });

  await criarImagensProduto(productId, imagensPreparadas, transaction);
}

/* Listar produtos */
controllers.listar = async (req, res) => {
  try {
    const data = await Product.findAll({
      attributes: {
        exclude: ["image"],
      },
      include: includeProdutoResumo,
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
    const sellerId = Number(req.params.sellerId);

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Vendedor inválido.",
      });
    }

    const data = await Product.findAll({
      where: { sellerId },
      attributes: {
        exclude: ["image"],
      },
      include: includeProdutoResumo,
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
  let transaction = null;

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
      images,
      categoryId,
      sellerId,
      variants,
    } = req.body;

    if (!name || !description || !price || !categoryId || !sellerId) {
      return res.status(400).json({
        success: false,
        message: "Preenche os campos obrigatórios do produto.",
      });
    }

    const preco = Number(price);

    if (!Number.isFinite(preco) || preco <= 0) {
      return res.status(400).json({
        success: false,
        message: "Indica um preço válido superior a 0.",
      });
    }

    const variantesPreparadas = prepararVariantes(variants, {
      size,
      color,
      stock,
    });

    const imagensPreparadas = prepararImagens(images, image);
    const imagemPrincipal = imagensPreparadas[0]?.image || null;

    const primeiraVariante = variantesPreparadas[0];
    const stockTotal = variantesPreparadas.reduce(
      (total, variant) => total + variant.stock,
      0
    );

    transaction = await sequelize.transaction();

    const vendedor = await User.findByPk(Number(sellerId), { transaction });

    if (!vendedor || vendedor.role !== "vendedor") {
      throw criarErro(403, "A conta indicada não é um vendedor válido.");
    }

    const produto = await Product.create(
      {
        name: String(name).trim(),
        description: String(description).trim(),
        price: preco,
        size: primeiraVariante.size,
        color: primeiraVariante.color,
        brand: brand ? String(brand).trim() : null,
        stock: stockTotal,
        condition,
        image: imagemPrincipal,
        categoryId: Number(categoryId),
        sellerId: Number(sellerId),
      },
      { transaction }
    );

    await ProductVariant.bulkCreate(
      variantesPreparadas.map((variant) => ({
        productId: produto.id,
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
      })),
      { transaction }
    );

    await criarImagensProduto(
      produto.id,
      imagensPreparadas,
      transaction
    );

    await transaction.commit();
    transaction = null;

    const produtoCriado = await Product.findByPk(produto.id, {
      include: includeProdutoCompleto,
    });

    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso.",
      data: produtoCriado,
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : "Erro ao criar produto.",
      error: error.status ? undefined : error.message,
    });
  }
};

/* Obter produto por id */
controllers.obter = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Product.findByPk(id, {
      include: includeProdutoCompleto,
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

/* Atualizar produto e respetivas variantes */
controllers.atualizar = async (req, res) => {
  let transaction = null;

  try {
    const { id } = req.params;
    const {
      variants,
      sellerId,
      name,
      description,
      price,
      brand,
      condition,
      image,
      images,
      categoryId,
      size,
      color,
      stock,
    } = req.body;

    transaction = await sequelize.transaction();

    const produto = await Product.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!produto) {
      throw criarErro(404, "Produto não encontrado.");
    }

    if (
      sellerId &&
      produto.sellerId &&
      Number(produto.sellerId) !== Number(sellerId)
    ) {
      throw criarErro(403, "Não tens autorização para editar este produto.");
    }

    const preco = Number(price);

    if (!Number.isFinite(preco) || preco <= 0) {
      throw criarErro(400, "Indica um preço válido superior a 0.");
    }

    const variantesPreparadas = prepararVariantes(variants, {
      size,
      color,
      stock,
    });

    const variantesAtuais = await ProductVariant.findAll({
      where: { productId: produto.id },
      transaction,
      lock: transaction.LOCK.UPDATE,
      order: [["id", "ASC"]],
    });

    const idsRecebidos = variantesPreparadas
      .filter((variant) => variant.id)
      .map((variant) => variant.id);

    for (const variant of variantesPreparadas) {
      if (variant.id) {
        const varianteExistente = variantesAtuais.find(
          (opcao) => Number(opcao.id) === Number(variant.id)
        );

        if (!varianteExistente) {
          throw criarErro(
            400,
            "Foi enviada uma opção que não pertence a este produto."
          );
        }

        await varianteExistente.update(
          {
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
          },
          { transaction }
        );
      } else {
        await ProductVariant.create(
          {
            productId: produto.id,
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
          },
          { transaction }
        );
      }
    }

    const variantesRemovidas = variantesAtuais.filter(
      (variant) => !idsRecebidos.includes(Number(variant.id))
    );

    for (const variant of variantesRemovidas) {
      const totalEmEncomendas = await OrderItem.count({
        where: { productVariantId: variant.id },
        transaction,
      });

      if (totalEmEncomendas > 0) {
        await variant.update({ stock: 0 }, { transaction });
      } else {
        await variant.destroy({ transaction });
      }
    }

    const variantesFinais = await ProductVariant.findAll({
      where: { productId: produto.id },
      transaction,
      order: [["id", "ASC"]],
    });

    if (variantesFinais.length === 0) {
      throw criarErro(400, "O produto deve ter pelo menos uma opção.");
    }

    const stockTotal = variantesFinais.reduce(
      (total, variant) => total + Number(variant.stock || 0),
      0
    );

    const primeiraVariante = variantesFinais[0];

    let imagemPrincipal = produto.image;

    if (Array.isArray(images)) {
      const imagensPreparadas = prepararImagens(images);

      await substituirImagensProduto(
        produto.id,
        imagensPreparadas,
        transaction
      );

      imagemPrincipal = imagensPreparadas[0]?.image || null;
    } else if (image !== undefined) {
      imagemPrincipal = image || null;
    }

    await produto.update(
      {
        name: String(name || produto.name).trim(),
        description: String(description || produto.description).trim(),
        price: preco,
        brand: brand ? String(brand).trim() : null,
        condition,
        image: imagemPrincipal,
        categoryId: Number(categoryId),
        size: primeiraVariante.size,
        color: primeiraVariante.color,
        stock: stockTotal,
      },
      { transaction }
    );

    await transaction.commit();
    transaction = null;

    const produtoAtualizado = await Product.findByPk(produto.id, {
      include: includeProdutoCompleto,
    });

    res.json({
      success: true,
      message: "Produto e opções atualizados com sucesso.",
      data: produtoAtualizado,
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    res.status(error.status || 500).json({
      success: false,
      message: error.status
        ? error.message
        : "Erro ao atualizar produto.",
      error: error.status ? undefined : error.message,
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
  let transaction;

  try {
    const { id } = req.params;

    transaction = await sequelize.transaction();

    const produto = await Product.findByPk(id, {
      transaction,
    });

    if (!produto) {
      await transaction.rollback();
      transaction = null;

      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    /*
      Um produto que já pertence a uma encomenda não deve ser
      apagado, porque faz parte do histórico da plataforma.
    */
    const totalItensEncomenda = await OrderItem.count({
      where: {
        productId: produto.id,
      },
      transaction,
    });

    if (totalItensEncomenda > 0) {
      await transaction.rollback();
      transaction = null;

      return res.status(409).json({
        success: false,
        message:
          "Este produto não pode ser apagado porque já pertence a uma encomenda.",
      });
    }

    /*
      Primeiro são removidas as imagens e variantes.
      Depois é removido o produto.
    */
    await ProductImage.destroy({
      where: {
        productId: produto.id,
      },
      transaction,
    });

    await ProductVariant.destroy({
      where: {
        productId: produto.id,
      },
      transaction,
    });

    await produto.destroy({
      transaction,
    });

    await transaction.commit();
    transaction = null;

    res.json({
      success: true,
      message: "Produto removido com sucesso.",
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    res.status(500).json({
      success: false,
      message: "Erro ao remover produto.",
      error: error.message,
    });
  }
};

module.exports = controllers;
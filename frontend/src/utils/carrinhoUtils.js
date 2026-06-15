export function obterCarrinho() {
  const carrinhoGuardado = localStorage.getItem("carrinho");

  if (!carrinhoGuardado) {
    return [];
  }

  return JSON.parse(carrinhoGuardado);
}

export function guardarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

export function adicionarAoCarrinho(produto, variante = null) {
  const carrinho = obterCarrinho();

  const variantId = variante ? variante.id : null;
  const size = variante ? variante.size : produto.size;
  const color = variante ? variante.color : produto.color;
  const stockDisponivel = variante
    ? Number(variante.stock || 0)
    : Number(produto.stock || 0);

  if (stockDisponivel <= 0) {
    return {
      success: false,
      message: "Este produto está esgotado.",
      carrinho,
    };
  }

  const produtoExistente = carrinho.find(
    (item) => item.id === produto.id && item.variantId === variantId
  );

  if (produtoExistente) {
    if (produtoExistente.quantidade >= stockDisponivel) {
      return {
        success: false,
        message: `Só existem ${stockDisponivel} unidade(s) disponíveis.`,
        carrinho,
      };
    }

    const carrinhoAtualizado = carrinho.map((item) =>
      item.id === produto.id && item.variantId === variantId
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );

    guardarCarrinho(carrinhoAtualizado);

    return {
      success: true,
      message: "Produto adicionado ao carrinho.",
      carrinho: carrinhoAtualizado,
    };
  }

  const novoProduto = {
    id: produto.id,
    variantId,
    name: produto.name,
    price: produto.price,
    image: produto.image,
    size,
    color,
    quantidade: 1,
  };

  const carrinhoAtualizado = [...carrinho, novoProduto];

  guardarCarrinho(carrinhoAtualizado);

  return {
    success: true,
    message: "Produto adicionado ao carrinho.",
    carrinho: carrinhoAtualizado,
  };
}

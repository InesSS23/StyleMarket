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

  const produtoExistente = carrinho.find(
    (item) => item.id === produto.id && item.variantId === variantId
  );

  if (produtoExistente) {
    const carrinhoAtualizado = carrinho.map((item) =>
      item.id === produto.id && item.variantId === variantId
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );

    guardarCarrinho(carrinhoAtualizado);
    return carrinhoAtualizado;
  }

  const novoProduto = {
    id: produto.id,
    variantId: variantId,
    name: produto.name,
    price: produto.price,
    image: produto.image,
    size: size,
    color: color,
    quantidade: 1,
  };

  const carrinhoAtualizado = [...carrinho, novoProduto];

  guardarCarrinho(carrinhoAtualizado);
  return carrinhoAtualizado;
}
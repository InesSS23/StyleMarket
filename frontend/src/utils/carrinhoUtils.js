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

export function adicionarAoCarrinho(produto) {
  const carrinho = obterCarrinho();

  const produtoExistente = carrinho.find((item) => item.id === produto.id);

  if (produtoExistente) {
    const carrinhoAtualizado = carrinho.map((item) =>
      item.id === produto.id
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );

    guardarCarrinho(carrinhoAtualizado);
    return carrinhoAtualizado;
  }

  const novoProduto = {
    id: produto.id,
    name: produto.name,
    price: produto.price,
    image: produto.image,
    size: produto.size,
    color: produto.color,
    quantidade: 1,
  };

  const carrinhoAtualizado = [...carrinho, novoProduto];

  guardarCarrinho(carrinhoAtualizado);
  return carrinhoAtualizado;
}
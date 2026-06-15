export function obterVariantes(produto) {
  if (Array.isArray(produto?.productVariants) && produto.productVariants.length > 0) {
    return produto.productVariants;
  }

  if (!produto) {
    return [];
  }

  return [
    {
      id: null,
      size: produto.size || "Único",
      color: produto.color || "Única",
      stock: Number(produto.stock || 0),
    },
  ];
}

export function calcularStockTotal(produto) {
  return obterVariantes(produto).reduce(
    (total, variante) => total + Number(variante.stock || 0),
    0
  );
}

export function obterTamanhosProduto(produto) {
  return [
    ...new Set(
      obterVariantes(produto)
        .map((variante) => variante.size)
        .filter(Boolean)
    ),
  ];
}

export function obterCoresProduto(produto) {
  return [
    ...new Set(
      obterVariantes(produto)
        .map((variante) => variante.color)
        .filter(Boolean)
    ),
  ];
}

export function contarVariantesEsgotadas(produto) {
  return obterVariantes(produto).filter(
    (variante) => Number(variante.stock || 0) <= 0
  ).length;
}

export function obterResumoVariantes(produto) {
  const variantes = obterVariantes(produto);
  const tamanhos = obterTamanhosProduto(produto);
  const cores = obterCoresProduto(produto);

  if (variantes.length === 1) {
    return `${tamanhos[0] || "Único"} · ${cores[0] || "Única"}`;
  }

  return `${variantes.length} opções · ${tamanhos.length} tamanho(s) · ${cores.length} cor(es)`;
}

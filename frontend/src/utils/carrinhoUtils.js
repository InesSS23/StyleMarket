import { obterUtilizador } from "./authUtils";

const CHAVE_CARRINHO_VISITANTE = "stylemarket_carrinho_visitante";
const CHAVE_CARRINHO_ANTIGO = "carrinho";

function lerCarrinho(chave) {
  const carrinhoGuardado = localStorage.getItem(chave);

  if (!carrinhoGuardado) {
    return [];
  }

  try {
    return JSON.parse(carrinhoGuardado);
  } catch {
    localStorage.removeItem(chave);
    return [];
  }
}

function obterChaveCarrinhoAtual() {
  const utilizador = obterUtilizador();

  if (!utilizador) {
    return CHAVE_CARRINHO_VISITANTE;
  }

  if (utilizador.role === "comprador") {
    return `stylemarket_carrinho_comprador_${utilizador.id}`;
  }

  return null;
}

export function obterCarrinho() {
  /* Remove o carrinho antigo partilhado por todos */
  localStorage.removeItem(CHAVE_CARRINHO_ANTIGO);

  const chaveCarrinho = obterChaveCarrinhoAtual();

  if (!chaveCarrinho) {
    return [];
  }

  return lerCarrinho(chaveCarrinho);
}

export function guardarCarrinho(carrinho) {
  const chaveCarrinho = obterChaveCarrinhoAtual();

  if (!chaveCarrinho) {
    return false;
  }

  localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
  return true;
}

export function limparCarrinhoVisitante() {
  localStorage.removeItem(CHAVE_CARRINHO_VISITANTE);
  localStorage.removeItem(CHAVE_CARRINHO_ANTIGO);
}

export function tratarCarrinhoAposLogin(utilizador) {
  const carrinhoVisitante = lerCarrinho(CHAVE_CARRINHO_VISITANTE);

  localStorage.removeItem(CHAVE_CARRINHO_ANTIGO);

  /*
    Vendedor e administrador não podem comprar.
    O carrinho criado antes do login é eliminado.
  */
  if (utilizador.role !== "comprador") {
    localStorage.removeItem(CHAVE_CARRINHO_VISITANTE);
    return [];
  }

  const chaveComprador =
    `stylemarket_carrinho_comprador_${utilizador.id}`;

  const carrinhoComprador = lerCarrinho(chaveComprador);
  let carrinhoFinal = [...carrinhoComprador];

  for (const itemVisitante of carrinhoVisitante) {
    const itemExistente = carrinhoFinal.find(
      (item) =>
        item.id === itemVisitante.id &&
        item.variantId === itemVisitante.variantId
    );

    if (itemExistente) {
      carrinhoFinal = carrinhoFinal.map((item) =>
        item.id === itemVisitante.id &&
        item.variantId === itemVisitante.variantId
          ? {
              ...item,
              quantidade:
                Number(item.quantidade) +
                Number(itemVisitante.quantidade),
            }
          : item
      );
    } else {
      carrinhoFinal.push(itemVisitante);
    }
  }

  localStorage.setItem(
    chaveComprador,
    JSON.stringify(carrinhoFinal)
  );

  localStorage.removeItem(CHAVE_CARRINHO_VISITANTE);

  return carrinhoFinal;
}

export function adicionarAoCarrinho(produto, variante = null) {
  const chaveCarrinho = obterChaveCarrinhoAtual();

  if (!chaveCarrinho) {
    return {
      success: false,
      message: "Este perfil não pode utilizar o carrinho.",
      carrinho: [],
    };
  }

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
    (item) =>
      item.id === produto.id &&
      item.variantId === variantId
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
      item.id === produto.id &&
      item.variantId === variantId
        ? {
            ...item,
            quantidade: item.quantidade + 1,
          }
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
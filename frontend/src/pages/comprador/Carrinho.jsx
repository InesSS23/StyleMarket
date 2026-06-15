import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { guardarCarrinho, obterCarrinho } from "../../utils/carrinhoUtils";

function obterChaveItem(item) {
  return `${item.id}-${item.variantId || "sem-variante"}`;
}

function criarPayload(lista) {
  return lista.map((item) => ({
    cartKey: obterChaveItem(item),
    productId: item.id,
    productVariantId: item.variantId,
    quantity: item.quantidade,
  }));
}

function Carrinho() {
  const [itens, setItens] = useState(() => obterCarrinho());
  const [validacoes, setValidacoes] = useState({});
  const [carrinhoValido, setCarrinhoValido] = useState(false);
  const [aValidar, setAValidar] = useState(true);
  const [erro, setErro] = useState("");

  function guardarResultadoValidacao(response) {
    const mapa = {};

    for (const resultado of response.data.data || []) {
      mapa[resultado.cartKey] = resultado;
    }

    setValidacoes(mapa);
    setCarrinhoValido(Boolean(response.data.carrinhoValido));
  }

  function validarCarrinho(lista) {
    if (lista.length === 0) {
      setValidacoes({});
      setCarrinhoValido(false);
      setAValidar(false);
      setErro("");
      return;
    }

    setAValidar(true);
    setErro("");

    api
      .post("/produtos/verificar-stock", {
        items: criarPayload(lista),
      })
      .then((response) => {
        if (response.data.success) {
          guardarResultadoValidacao(response);
        } else {
          setCarrinhoValido(false);
          setErro("Não foi possível verificar o stock do carrinho.");
        }
      })
      .catch(() => {
        setCarrinhoValido(false);
        setErro("Erro ao verificar o stock. Tenta novamente.");
      })
      .finally(() => {
        setAValidar(false);
      });
  }

  useEffect(() => {
    const itensAtuais = obterCarrinho();

    if (itensAtuais.length === 0) {
      return;
    }

    api
      .post("/produtos/verificar-stock", {
        items: criarPayload(itensAtuais),
      })
      .then((response) => {
        if (response.data.success) {
          guardarResultadoValidacao(response);
        } else {
          setCarrinhoValido(false);
          setErro("Não foi possível verificar o stock do carrinho.");
        }
      })
      .catch(() => {
        setCarrinhoValido(false);
        setErro("Erro ao verificar o stock. Tenta novamente.");
      })
      .finally(() => {
        setAValidar(false);
      });
  }, []);

  function atualizarQuantidade(itemSelecionado, novaQuantidade) {
    if (novaQuantidade < 1) {
      return;
    }

    const chave = obterChaveItem(itemSelecionado);
    const validacao = validacoes[chave];

    if (
      validacao &&
      novaQuantidade > Number(validacao.stockDisponivel || 0)
    ) {
      alert(`Só existem ${validacao.stockDisponivel} unidade(s) disponíveis.`);
      return;
    }

    const carrinhoAtualizado = itens.map((item) =>
      obterChaveItem(item) === chave
        ? { ...item, quantidade: novaQuantidade }
        : item
    );

    setItens(carrinhoAtualizado);
    guardarCarrinho(carrinhoAtualizado);
    validarCarrinho(carrinhoAtualizado);
  }

  function removerProduto(itemSelecionado) {
    const chave = obterChaveItem(itemSelecionado);

    const carrinhoAtualizado = itens.filter(
      (item) => obterChaveItem(item) !== chave
    );

    setItens(carrinhoAtualizado);
    guardarCarrinho(carrinhoAtualizado);
    validarCarrinho(carrinhoAtualizado);
  }

  const subtotal = itens.reduce(
    (soma, item) => soma + Number(item.price) * item.quantidade,
    0
  );

  const envio = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + envio;

  if (itens.length === 0) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center">
        <div className="container py-5 text-center">
          <h1 className="fw-bold mb-2">O teu carrinho está vazio</h1>

          <p className="text-muted mb-4">
            Adiciona produtos ao carrinho para começares a tua compra.
          </p>

          <Link to="/catalogo" className="btn btn-primary px-5">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-1">Carrinho de Compras</h1>
            <p className="text-muted mb-0">
              Revê os produtos antes de finalizar a encomenda.
            </p>
          </div>
        </div>

        {erro && <div className="alert alert-danger">{erro}</div>}

        {!aValidar && !carrinhoValido && (
          <div className="alert alert-warning">
            Existem produtos esgotados ou quantidades superiores ao stock.
            Corrige ou remove esses produtos para poderes finalizar a compra.
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            {itens.map((item) => {
              const chave = obterChaveItem(item);
              const validacao = validacoes[chave];
              const itemInvalido = validacao && !validacao.disponivel;
              const itemEsgotado = validacao && validacao.esgotado;

              return (
                <div
                  className={`card shadow-sm mb-3 cart-item-card ${
                    itemInvalido
                      ? "cart-item-indisponivel border-secondary"
                      : "border-0"
                  }`}
                  key={chave}
                >
                  <div className="card-body p-4">
                    <div className="d-flex gap-3">
                      <img
                        src={item.image || "/images/produtos/sem-imagem.jpg"}
                        alt={item.name}
                        className="cart-product-image"
                      />

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between gap-3">
                          <div>
                            <h5 className="fw-bold mb-1">{item.name}</h5>

                            <div className="d-flex gap-2 mb-3">
                              <span className="badge bg-light text-dark border">
                                Tam. {item.size}
                              </span>

                              <span className="badge bg-light text-dark border">
                                {item.color}
                              </span>
                            </div>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger align-self-start"
                            onClick={() => removerProduto(item)}
                          >
                            Remover
                          </button>
                        </div>

                        {itemInvalido && (
                          <div className="alert alert-danger py-2 mb-3">
                            {validacao.message}
                          </div>
                        )}

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm quantity-button"
                              disabled={itemEsgotado}
                              onClick={() =>
                                atualizarQuantidade(item, item.quantidade - 1)
                              }
                            >
                              -
                            </button>

                            <span className="fw-bold quantity-number">
                              {item.quantidade}
                            </span>

                            <button
                              className="btn btn-outline-secondary btn-sm quantity-button"
                              disabled={
                                itemEsgotado ||
                                (validacao &&
                                  item.quantidade >=
                                    Number(validacao.stockDisponivel || 0))
                              }
                              onClick={() =>
                                atualizarQuantidade(item, item.quantidade + 1)
                              }
                            >
                              +
                            </button>
                          </div>

                          <div className="text-md-end">
                            <small className="text-muted d-block">
                              {Number(item.price).toFixed(2)} € cada
                            </small>

                            <strong className="fs-5">
                              {(Number(item.price) * item.quantidade).toFixed(2)} €
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm order-summary-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Resumo da Encomenda</h5>

                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>
                    Subtotal ({itens.length}{" "}
                    {itens.length === 1 ? "item" : "itens"})
                  </span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>

                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Envio</span>
                  <span>
                    {envio === 0 ? "Grátis" : `${envio.toFixed(2)} €`}
                  </span>
                </div>

                {subtotal < 50 && (
                  <small className="text-muted d-block mb-3">
                    Envio grátis em compras a partir de 50 €.
                  </small>
                )}

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>

                {aValidar ? (
                  <button className="btn btn-secondary w-100 mb-2" disabled>
                    A verificar stock...
                  </button>
                ) : carrinhoValido ? (
                  <Link
                    to="/finalizar-compra"
                    className="btn btn-primary w-100 mb-2"
                  >
                    Finalizar compra
                  </Link>
                ) : (
                  <button className="btn btn-secondary w-100 mb-2" disabled>
                    Corrige o carrinho para continuar
                  </button>
                )}

                <Link
                  to="/catalogo"
                  className="btn btn-outline-secondary w-100"
                >
                  Continuar a comprar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrinho;

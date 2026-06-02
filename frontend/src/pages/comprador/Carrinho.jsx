import { useState } from "react";
import { Link } from "react-router-dom";
import { guardarCarrinho, obterCarrinho } from "../../utils/carrinhoUtils";

function Carrinho() {
  const [itens, setItens] = useState(() => obterCarrinho());

  function atualizarQuantidade(id, novaQuantidade) {
    if (novaQuantidade < 1) {
      return;
    }

    const carrinhoAtualizado = itens.map((item) =>
      item.id === id ? { ...item, quantidade: novaQuantidade } : item
    );

    setItens(carrinhoAtualizado);
    guardarCarrinho(carrinhoAtualizado);
  }

  function removerProduto(id) {
    const carrinhoAtualizado = itens.filter((item) => item.id !== id);

    setItens(carrinhoAtualizado);
    guardarCarrinho(carrinhoAtualizado);
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

        <div className="row g-4">
          <div className="col-lg-8">
            {itens.map((item) => (
              <div className="card border-0 shadow-sm mb-3 cart-item-card" key={item.id}>
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
                          onClick={() => removerProduto(item.id)}
                        >
                          Remover
                        </button>
                      </div>

                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm quantity-button"
                            onClick={() =>
                              atualizarQuantidade(item.id, item.quantidade - 1)
                            }
                          >
                            -
                          </button>

                          <span className="fw-bold quantity-number">
                            {item.quantidade}
                          </span>

                          <button
                            className="btn btn-outline-secondary btn-sm quantity-button"
                            onClick={() =>
                              atualizarQuantidade(item.id, item.quantidade + 1)
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
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm order-summary-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Resumo da Encomenda</h5>

                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>
                    Subtotal ({itens.length} {itens.length === 1 ? "item" : "itens"})
                  </span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>

                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Envio</span>
                  <span>{envio === 0 ? "Grátis" : `${envio.toFixed(2)} €`}</span>
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

                <Link to="/finalizar-compra" className="btn btn-primary w-100 mb-2">
                  Finalizar compra
                </Link>

                <Link to="/catalogo" className="btn btn-outline-secondary w-100">
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
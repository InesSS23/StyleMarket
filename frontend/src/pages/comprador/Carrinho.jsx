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

  const total = itens.reduce(
    (soma, item) => soma + Number(item.price) * item.quantidade,
    0
  );

  if (itens.length === 0) {
    return (
      <div className="container py-5">
        <h1>Carrinho</h1>

        <div className="alert alert-info mt-4">
          O teu carrinho ainda está vazio.
        </div>

        <Link to="/catalogo" className="btn btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1>Carrinho</h1>
          <p className="text-muted">Confirma os produtos antes de finalizar.</p>
        </div>

        <Link to="/catalogo" className="btn btn-outline-dark align-self-start">
          Continuar a comprar
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image || "/images/produtos/sem-imagem.jpg"}
                            alt={item.name}
                            className="cart-product-image"
                          />

                          <div>
                            <strong>{item.name}</strong>
                            <br />
                            <small className="text-muted">
                              {item.size} · {item.color}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{Number(item.price).toFixed(2)} €</td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              atualizarQuantidade(item.id, item.quantidade - 1)
                            }
                          >
                            -
                          </button>

                          <span>{item.quantidade}</span>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              atualizarQuantidade(item.id, item.quantidade + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>
                        {(Number(item.price) * item.quantidade).toFixed(2)} €
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removerProduto(item.id)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Resumo</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} €</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Envio</span>
                <span>Grátis</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>{total.toFixed(2)} €</strong>
              </div>

              <Link to="/finalizar-compra" className="btn btn-primary w-100">
                Finalizar compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrinho;
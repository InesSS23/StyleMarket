import { useEffect, useState } from "react";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

function calcularTotalItens(encomenda) {
  return (encomenda.orderItems || []).reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

function obterDetalhesVariante(item) {
  const variante = item.productVariant;

  if (variante) {
    return `${variante.size} · ${variante.color}`;
  }

  if (item.product) {
    return `${item.product.size || "Único"} · ${
      item.product.color || "Única"
    }`;
  }

  return "Opção não disponível";
}

function VendasVendedor() {
  const sellerId = getSellerId();

  const [encomendas, setEncomendas] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let componenteAtivo = true;

    if (!sellerId) {
      Promise.resolve().then(() => {
        if (componenteAtivo) {
          setErro("Não foi possível identificar o vendedor autenticado.");
          setCarregando(false);
        }
      });

      return () => {
        componenteAtivo = false;
      };
    }

    api
      .get(`/encomendas/listar/vendedor/${sellerId}`)
      .then((response) => {
        if (!componenteAtivo) {
          return;
        }

        if (response.data?.success) {
          setEncomendas(response.data.data || []);
          setErro("");
        } else {
          setErro("Não foi possível carregar as vendas.");
        }
      })
      .catch(() => {
        if (componenteAtivo) {
          setErro("Erro ao ligar ao servidor.");
        }
      })
      .finally(() => {
        if (componenteAtivo) {
          setCarregando(false);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, [sellerId]);

  const totalReceita = encomendas.reduce(
    (total, encomenda) => total + calcularTotalItens(encomenda),
    0
  );

  const produtosVendidos = encomendas.reduce(
    (total, encomenda) =>
      total +
      (encomenda.orderItems || []).reduce(
        (subtotal, item) => subtotal + Number(item.quantity || 0),
        0
      ),
    0
  );

  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const receitaMes = encomendas.reduce((total, encomenda) => {
    const dataEncomenda = encomenda.createdAt
      ? new Date(encomenda.createdAt)
      : null;

    if (
      dataEncomenda &&
      dataEncomenda.getMonth() === mesAtual &&
      dataEncomenda.getFullYear() === anoAtual
    ) {
      return total + calcularTotalItens(encomenda);
    }

    return total;
  }, 0);

  function classeEstado(estado) {
    if (estado === "Concluída" || estado === "Entregue") {
      return "badge bg-success";
    }

    if (estado === "Cancelada") {
      return "badge bg-danger";
    }

    return "badge bg-warning text-dark";
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1>As Minhas Vendas</h1>
        <p className="text-muted mb-0">
          Consulta os produtos, tamanhos e cores vendidos em cada encomenda.
        </p>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-4">
          <div className="card shadow-sm p-4 h-100">
            <p className="mb-1 text-muted">Receita do mês</p>
            <h3 className="mb-0">{receitaMes.toFixed(2)} €</h3>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="card shadow-sm p-4 h-100">
            <p className="mb-1 text-muted">Receita Total</p>
            <h3 className="mb-0">{totalReceita.toFixed(2)} €</h3>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="card shadow-sm p-4 h-100">
            <p className="mb-1 text-muted">Total de produtos vendidos</p>
            <h3 className="mb-0">{produtosVendidos}</h3>
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="alert alert-secondary">A carregar vendas...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>N.º Encomenda</th>
                <th>Produto</th>
                <th>Opção vendida</th>
                <th>Comprador</th>
                <th>Quantidade</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {encomendas.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    Não existem vendas a mostrar.
                  </td>
                </tr>
              )}

              {encomendas.flatMap((encomenda) =>
                (encomenda.orderItems || []).map((item) => (
                  <tr key={`${encomenda.id}-${item.id}`}>
                    <td>VND-{String(encomenda.id).padStart(3, "0")}</td>

                    <td>
                      <strong>
                        {item.product?.name || "Produto desconhecido"}
                      </strong>
                    </td>

                    <td>{obterDetalhesVariante(item)}</td>

                    <td>
                      {encomenda.buyer?.name ||
                        encomenda.customerName ||
                        "Cliente"}
                    </td>

                    <td>{Number(item.quantity || 0)}</td>

                    <td>
                      {(
                        Number(item.price || 0) * Number(item.quantity || 0)
                      ).toFixed(2)}{" "}
                      €
                    </td>

                    <td>
                      <span className={classeEstado(encomenda.status)}>
                        {encomenda.status}
                      </span>
                    </td>

                    <td>
                      {encomenda.createdAt
                        ? new Date(encomenda.createdAt).toLocaleDateString(
                            "pt-PT"
                          )
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VendasVendedor;

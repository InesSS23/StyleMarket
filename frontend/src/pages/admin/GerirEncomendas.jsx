import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

function GerirEncomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const carregarEncomendas = useCallback(() => {
    setCarregando(true);

    api
      .get("/encomendas/listar")
      .then((response) => {
        if (response.data.success) {
          setEncomendas(response.data.data);
        }
      })
      .catch(() => {
        setErro("Erro ao carregar encomendas.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(carregarEncomendas, 0);
    return () => clearTimeout(timer);
  }, [carregarEncomendas]);

  function estadoClass(estado) {
    if (estado === "Concluída") return "admin-badge admin-badge--green";
    if (estado === "Enviada") return "admin-badge admin-badge--blue";
    if (estado === "Paga") return "admin-badge admin-badge--purple";
    if (estado === "Pendente") return "admin-badge admin-badge--yellow";
    if (estado === "Cancelada") return "admin-badge admin-badge--red";
    return "admin-badge admin-badge--gray";
  }

  function contarEstado(estado) {
    return encomendas.filter((encomenda) => encomenda.status === estado).length;
  }

  function formatarPreco(valor) {
    return `${Number(valor || 0).toFixed(2)}€`;
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-PT");
  }

  const [atualizandoId, setAtualizandoId] = useState(null);

  function podeAvancar(status) {
    return status === "Pendente" || status === "Paga" || status === "Enviada";
  }

  function proximoEstado(status) {
    if (status === "Pendente") return "Paga";
    if (status === "Paga") return "Enviada";
    if (status === "Enviada") return "Concluída";
    return null;
  }

  async function avancarEncomenda(encomenda) {
    const novoEstado = proximoEstado(encomenda.status);

    if (!novoEstado) {
      setErro("Não é possível avançar o estado desta encomenda.");
      return;
    }

    setErro("");
    setAtualizandoId(encomenda.id);

    try {
      const response = await api.put(`/encomendas/atualizar-status/${encomenda.id}`, {
        status: novoEstado,
      });

      if (response.data.success) {
        carregarEncomendas();
      } else {
        setErro(response.data.message || "Erro ao atualizar estado da encomenda.");
      }
    } catch (error) {
      setErro("Erro ao atualizar estado da encomenda.");
    } finally {
      setAtualizandoId(null);
    }
  }

  function detalhesEncomenda(encomenda) {
    alert(
      `Encomenda #${encomenda.id}\nComprador: ${
        encomenda.buyer?.name || encomenda.customerName || "Sem nome"
      }\nTotal: ${formatarPreco(encomenda.total)}\nEstado: ${encomenda.status}`
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Encomendas</h1>
        <p>Supervisiona e gere todas as encomendas da plataforma.</p>
      </div>

      <div className="admin-order-summary">
        <span className="admin-order-pill admin-order-pill--yellow">
          {contarEstado("Pendente")} Pendente
        </span>

        <span className="admin-order-pill admin-order-pill--purple">
          {contarEstado("Paga")} Paga
        </span>

        <span className="admin-order-pill admin-order-pill--blue">
          {contarEstado("Enviada")} Enviada
        </span>

        <span className="admin-order-pill admin-order-pill--green">
          {contarEstado("Concluída")} Concluída
        </span>

        <span className="admin-order-pill admin-order-pill--red">
          {contarEstado("Cancelada")} Cancelada
        </span>
      </div>

      <div className="admin-single-filter-card">
        <input
          className="admin-search-input"
          placeholder="Pesquisar por número de encomenda ou comprador..."
        />
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <p className="admin-results-text">
        A mostrar {encomendas.length} encomendas
      </p>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Nº Encomenda</th>
              <th>Comprador</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  A carregar encomendas...
                </td>
              </tr>
            )}

            {!carregando &&
              encomendas.map((encomenda) => (
                <tr key={encomenda.id}>
                  <td>
                    <strong>#{encomenda.id}</strong>
                  </td>

                  <td>
                    <strong>
                      {encomenda.buyer?.name ||
                        encomenda.customerName ||
                        "Sem nome"}
                    </strong>
                    <small>
                      {encomenda.buyer?.email ||
                        encomenda.customerEmail ||
                        "Sem email"}
                    </small>
                  </td>

                  <td>
                    <span className="admin-items-circle">
                      {encomenda.orderItems?.length || 0}
                    </span>
                  </td>

                  <td>
                    <strong>{formatarPreco(encomenda.total)}</strong>
                  </td>

                  <td>
                    <span className={estadoClass(encomenda.status)}>
                      {encomenda.status}
                    </span>
                  </td>

                  <td>{formatarData(encomenda.createdAt)}</td>

                  <td>
                    <div className="admin-order-actions">
                      <button
                        className="admin-details-button"
                        onClick={() => detalhesEncomenda(encomenda)}
                      >
                        👁 Detalhes
                      </button>

                      {podeAvancar(encomenda.status) && (
                        <button
                          className="admin-next-button"
                          onClick={() => avancarEncomenda(encomenda)}
                          disabled={atualizandoId === encomenda.id}
                        >
                          {atualizandoId === encomenda.id ? "A atualizar..." : "↻ Avançar"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

            {!carregando && encomendas.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Ainda não existem encomendas registadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default GerirEncomendas;
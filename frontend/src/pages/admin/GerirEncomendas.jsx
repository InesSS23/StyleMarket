import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function GerirEncomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [encomendaSelecionada, setEncomendaSelecionada] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState(null);

  const carregarEncomendas = useCallback(() => {
    setCarregando(true);
    setErro("");

    api
      .get("/encomendas/listar")
      .then((response) => {
        if (response.data.success) {
          setEncomendas(response.data.data);
        } else {
          setErro("Não foi possível carregar as encomendas.");
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

  const encomendasFiltradas = useMemo(() => {
    const texto = pesquisa.trim().toLowerCase();

    return encomendas.filter((encomenda) => {
      const comprador = encomenda.buyer?.name || encomenda.customerName || "";
      const email = encomenda.buyer?.email || encomenda.customerEmail || "";

      const correspondePesquisa =
        texto === "" ||
        String(encomenda.id).includes(texto) ||
        comprador.toLowerCase().includes(texto) ||
        email.toLowerCase().includes(texto);

      const correspondeEstado =
        filtroEstado === "" || encomenda.status === filtroEstado;

      return correspondePesquisa && correspondeEstado;
    });
  }, [encomendas, pesquisa, filtroEstado]);

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
    return `${Number(valor || 0).toFixed(2)} €`;
  }

  function formatarData(data, incluirHora = false) {
    if (!data) return "-";

    const opcoes = incluirHora
      ? {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };

    return new Intl.DateTimeFormat("pt-PT", opcoes).format(new Date(data));
  }

  function contarUnidades(encomenda) {
    return (encomenda.orderItems || []).reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }

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

    const confirmou = window.confirm(
      `Alterar a encomenda #${encomenda.id} de ${encomenda.status} para ${novoEstado}?`
    );

    if (!confirmou) {
      return;
    }

    setErro("");
    setAtualizandoId(encomenda.id);

    try {
      const response = await api.put(
        `/encomendas/atualizar-status/${encomenda.id}`,
        {
          status: novoEstado,
        }
      );

      if (response.data.success) {
        setEncomendas((listaAtual) =>
          listaAtual.map((item) =>
            item.id === encomenda.id
              ? {
                  ...item,
                  status: response.data.data.status,
                }
              : item
          )
        );

        setEncomendaSelecionada((selecionada) =>
          selecionada?.id === encomenda.id
            ? {
                ...selecionada,
                status: response.data.data.status,
              }
            : selecionada
        );
      } else {
        setErro(response.data.message || "Erro ao atualizar a encomenda.");
      }
    } catch (error) {
      setErro(
        error.response?.data?.message ||
          "Erro ao atualizar o estado da encomenda."
      );
    } finally {
      setAtualizandoId(null);
    }
  }

  function limparFiltros() {
    setPesquisa("");
    setFiltroEstado("");
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Encomendas</h1>
        <p>Consulta as encomendas e acompanha o respetivo estado.</p>
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

      <div className="admin-order-filter-card">
        <input
          className="admin-search-input"
          placeholder="Pesquisar por número, nome ou email..."
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
        />

        <select
          className="admin-select"
          value={filtroEstado}
          onChange={(event) => setFiltroEstado(event.target.value)}
        >
          <option value="">Todos os estados</option>
          <option value="Pendente">Pendente</option>
          <option value="Paga">Paga</option>
          <option value="Enviada">Enviada</option>
          <option value="Concluída">Concluída</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={limparFiltros}
        >
          Limpar
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <p className="admin-results-text">
        A mostrar {encomendasFiltradas.length} de {encomendas.length} encomendas
      </p>

      <section className="admin-table-card admin-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Nº Encomenda</th>
              <th>Comprador</th>
              <th>Unidades</th>
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
              encomendasFiltradas.map((encomenda) => (
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
                      {contarUnidades(encomenda)}
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
                        type="button"
                        className="admin-details-button"
                        onClick={() => setEncomendaSelecionada(encomenda)}
                      >
                        <img
                          src="/images/olho.png"
                          alt=""
                          className="admin-details-icon"
                        />
                        Detalhes
                      </button>

                      {podeAvancar(encomenda.status) && (
                        <button
                          type="button"
                          className="admin-next-button"
                          onClick={() => avancarEncomenda(encomenda)}
                          disabled={atualizandoId === encomenda.id}
                        >
                          {atualizandoId === encomenda.id
                            ? "A atualizar..."
                            : `Avançar para ${proximoEstado(encomenda.status)}`}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

            {!carregando && encomendasFiltradas.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  Não foram encontradas encomendas com estes filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {encomendaSelecionada && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={() => setEncomendaSelecionada(null)}
        >
          <div
            className="admin-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-detalhes-encomenda"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <small>Encomenda</small>
                <h2 id="titulo-detalhes-encomenda">
                  #{encomendaSelecionada.id}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEncomendaSelecionada(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-order-detail-grid">
                <div className="admin-order-detail-card">
                  <span>Comprador</span>
                  <strong>
                    {encomendaSelecionada.buyer?.name ||
                      encomendaSelecionada.customerName ||
                      "Sem nome"}
                  </strong>
                  <small>
                    {encomendaSelecionada.buyer?.email ||
                      encomendaSelecionada.customerEmail ||
                      "Sem email"}
                  </small>
                  <small>{encomendaSelecionada.customerPhone || "Sem contacto"}</small>
                </div>

                <div className="admin-order-detail-card">
                  <span>Envio</span>
                  <strong>{encomendaSelecionada.address || "Sem morada"}</strong>
                  <small>
                    {encomendaSelecionada.postalCode || "Sem código postal"}
                    {encomendaSelecionada.city
                      ? `, ${encomendaSelecionada.city}`
                      : ""}
                  </small>
                </div>

                <div className="admin-order-detail-card">
                  <span>Pagamento</span>
                  <strong>
                    {encomendaSelecionada.paymentMethod || "Não indicado"}
                  </strong>
                  <small>
                    Criada em {formatarData(encomendaSelecionada.createdAt, true)}
                  </small>
                </div>

                <div className="admin-order-detail-card">
                  <span>Estado</span>
                  <div>
                    <span className={estadoClass(encomendaSelecionada.status)}>
                      {encomendaSelecionada.status}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="admin-order-items-title">Produtos da encomenda</h3>

              <div className="admin-order-items-list">
                {(encomendaSelecionada.orderItems || []).map((item) => (
                  <div className="admin-order-item-row" key={item.id}>
                    <div className="admin-order-item-info">
                      <strong>{item.product?.name || "Produto removido"}</strong>
                      <small>
                        Vendedor: {item.product?.seller?.storeName ||
                          item.product?.seller?.name ||
                          "Não disponível"}
                      </small>
                      <small>
                        Categoria: {item.product?.category?.name || "Sem categoria"}
                      </small>
                      {item.productVariant && (
                        <small>
                          Variante: {item.productVariant.color || "Sem cor"} · {" "}
                          {item.productVariant.size || "Sem tamanho"}
                        </small>
                      )}
                    </div>

                    <div className="admin-order-item-values">
                      <span>{item.quantity} unidade(s)</span>
                      <span>{formatarPreco(item.price)} cada</span>
                      <strong>
                        {formatarPreco(
                          Number(item.price || 0) * Number(item.quantity || 0)
                        )}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-order-totals">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatarPreco(encomendaSelecionada.subtotal)}</strong>
                </div>
                <div>
                  <span>Envio</span>
                  <strong>{formatarPreco(encomendaSelecionada.shipping)}</strong>
                </div>
                <div className="admin-order-total-final">
                  <span>Total</span>
                  <strong>{formatarPreco(encomendaSelecionada.total)}</strong>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setEncomendaSelecionada(null)}
              >
                Fechar
              </button>

              {podeAvancar(encomendaSelecionada.status) && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => avancarEncomenda(encomendaSelecionada)}
                  disabled={atualizandoId === encomendaSelecionada.id}
                >
                  {atualizandoId === encomendaSelecionada.id
                    ? "A atualizar..."
                    : `Avançar para ${proximoEstado(
                        encomendaSelecionada.status
                      )}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerirEncomendas;
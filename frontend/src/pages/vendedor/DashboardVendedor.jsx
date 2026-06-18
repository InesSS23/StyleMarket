import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { obterUtilizador } from "../../utils/authUtils";
import {
  calcularStockTotal,
  contarVariantesEsgotadas,
  obterImagensProduto,
  obterResumoVariantes,
  obterVariantes,
} from "../../utils/produtoUtils";

function mostrarEstadoStock(produto) {
  const stockTotal = calcularStockTotal(produto);
  const variantesEsgotadas = contarVariantesEsgotadas(produto);
  const totalVariantes = obterVariantes(produto).length;

  if (stockTotal <= 0) {
    return <span className="badge bg-danger">Esgotado</span>;
  }

  if (stockTotal <= 2) {
    return (
      <span className="badge bg-warning text-dark">
        Stock baixo: {stockTotal}
      </span>
    );
  }

  return (
    <div>
      <span className="badge bg-success">Stock: {stockTotal}</span>
      {variantesEsgotadas > 0 && totalVariantes > 1 && (
        <div className="text-danger small mt-1">
          {variantesEsgotadas} opção(ões) esgotada(s)
        </div>
      )}
    </div>
  );
}

function DashboardVendedor() {
  const utilizador = obterUtilizador();
  const sellerId = utilizador ? Number(utilizador.id) : null;

  const nomePublicoVendedor =
    utilizador?.storeName || utilizador?.name || "Vendedor";

  const [produtos, setProdutos] = useState([]);
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

    Promise.all([
      api.get(`/produtos/listar/vendedor/${sellerId}`),
      api.get(`/encomendas/listar/vendedor/${sellerId}`),
    ])
      .then(([respostaProdutos, respostaEncomendas]) => {
        if (!componenteAtivo) {
          return;
        }

        setProdutos(
          respostaProdutos.data?.success
            ? respostaProdutos.data.data || []
            : []
        );

        setEncomendas(
          respostaEncomendas.data?.success
            ? respostaEncomendas.data.data || []
            : []
        );
      })
      .catch(() => {
        if (componenteAtivo) {
          setErro("Erro ao carregar os dados do vendedor.");
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

  function apagarProduto(id) {
    const confirmar = window.confirm(
      "Tem a certeza de que pretende apagar este produto?"
    );

    if (!confirmar) {
      return;
    }

    api
      .delete(`/produtos/apagar/${id}`)
      .then((response) => {
        if (response.data?.success) {
          setProdutos((produtosAtuais) =>
            produtosAtuais.filter((produto) => produto.id !== id)
          );
        } else {
          alert("Não foi possível apagar o produto.");
        }
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Erro ao ligar ao servidor.");
      });
  }

  const produtosAtivos = produtos.filter(
    (produto) => calcularStockTotal(produto) > 0
  ).length;

  const produtosEsgotados = produtos.filter(
    (produto) => calcularStockTotal(produto) <= 0
  ).length;

  const variantesEsgotadas = produtos.reduce(
    (total, produto) => total + contarVariantesEsgotadas(produto),
    0
  );

  const pedidosPendentes = encomendas.filter(
    (encomenda) => encomenda.status === "Pendente"
  ).length;

  const totalVendas = encomendas.reduce((total, encomenda) => {
    const itens = encomenda.orderItems || [];

    return (
      total +
      itens.reduce(
        (subtotal, item) => subtotal + Number(item.quantity || 0),
        0
      )
    );
  }, 0);

  const totalRecebido = encomendas.reduce((total, encomenda) => {
    const itens = encomenda.orderItems || [];

    return (
      total +
      itens.reduce(
        (subtotal, item) =>
          subtotal +
          Number(item.quantity || 0) * Number(item.price || 0),
        0
      )
    );
  }, 0);

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-2">Dashboard do Vendedor</h1>
          <p className="text-muted mb-0">
            Bem-vindo de volta, {nomePublicoVendedor}! Aqui está um resumo da
            tua atividade.
          </p>
        </div>

        <Link
          className="btn btn-primary align-self-start"
          to="/vendedor/adicionar-produto"
        >
          + Adicionar Produto
        </Link>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {carregando && (
        <div className="alert alert-secondary">
          A carregar dados do vendedor...
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm p-4">
            <p className="mb-1 text-muted">Produtos Ativos</p>
            <h3 className="mb-0">{produtosAtivos}</h3>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm p-4">
            <p className="mb-1 text-muted">Produtos Esgotados</p>
            <h3 className="mb-0 text-danger">{produtosEsgotados}</h3>
            {variantesEsgotadas > produtosEsgotados && (
              <small className="text-muted">
                {variantesEsgotadas} opções sem stock no total
              </small>
            )}
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm p-4">
            <p className="mb-1 text-muted">Produtos Vendidos</p>
            <h3 className="mb-0">{totalVendas}</h3>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm p-4">
            <p className="mb-1 text-muted">Encomendas Pendentes</p>
            <h3 className="mb-0">{pedidosPendentes}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <p className="mb-1 text-muted">Total Recebido</p>
          <h3 className="mb-0">{totalRecebido.toFixed(2)} €</h3>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
            <h5 className="fw-bold mb-0">Os Meus Produtos</h5>

            <Link to="/vendedor/produtos" className="text-decoration-none">
              Ver todos →
            </Link>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Opções</th>
                  <th>Preço</th>
                  <th>Stock</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {produtos.slice(0, 5).map((produto) => {
                  const stockTotal = calcularStockTotal(produto);

                  return (
                    <tr
                      key={produto.id}
                      className={stockTotal <= 0 ? "table-danger" : ""}
                    >
                      <td>
                        <img
                          src={obterImagensProduto(produto)[0]}
                          alt={produto.name}
                          className="rounded border"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            filter:
                              stockTotal <= 0 ? "grayscale(80%)" : "none",
                          }}
                        />
                      </td>

                      <td>
                        <span className="fw-semibold">{produto.name}</span>
                        <div className="text-muted small">
                          {produto.brand || "Sem marca"}
                        </div>
                      </td>

                      <td>{produto.category?.name || "Sem categoria"}</td>

                      <td>
                        <span className="small">
                          {obterResumoVariantes(produto)}
                        </span>
                      </td>

                      <td>{Number(produto.price).toFixed(2)} €</td>

                      <td>{mostrarEstadoStock(produto)}</td>

                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <Link
                            className="btn btn-sm btn-outline-primary"
                            to={`/vendedor/editar-produto/${produto.id}`}
                          >
                            Editar
                          </Link>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger vendor-icon-button"
                            title="Apagar produto"
                            aria-label="Apagar produto"
                            onClick={() => apagarProduto(produto.id)}
                          >
                            <img
                              src="/images/lixo.png"
                              alt=""
                              className="vendor-action-icon"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!carregando && produtos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      Ainda não tens produtos publicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardVendedor;
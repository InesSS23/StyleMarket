import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { obterIdVendedor } from "../../utils/authUtils";
import {
  calcularStockTotal,
  contarVariantesEsgotadas,
  obterCoresProduto,
  obterResumoVariantes,
  obterTamanhosProduto,
  obterVariantes,
} from "../../utils/produtoUtils";

function ProdutosVendedor() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tamanhoFiltro, setTamanhoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [stockFiltro, setStockFiltro] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const sellerId = obterIdVendedor();

  const carregarProdutos = useCallback(() => {
    if (!sellerId) {
      setErro("Não foi possível identificar o vendedor autenticado.");
      setCarregando(false);
      return;
    }

    api
      .get(`/produtos/listar/vendedor/${sellerId}`)
      .then((response) => {
        if (response.data?.success) {
          setProdutos(response.data.data || []);
          setErro("");
        } else {
          setErro("Não foi possível carregar os produtos.");
        }
      })
      .catch(() => {
        setErro("Erro ao ligar ao servidor.");
      })
      .finally(() => setCarregando(false));
  }, [sellerId]);

  useEffect(() => {
    const timer = setTimeout(carregarProdutos, 0);
    return () => clearTimeout(timer);
  }, [carregarProdutos]);

  const categoriasDisponiveis = useMemo(
    () =>
      [
        ...new Set(
          produtos.map((produto) => produto.category?.name).filter(Boolean)
        ),
      ].sort(),
    [produtos]
  );

  const tamanhosDisponiveis = useMemo(
    () =>
      [
        ...new Set(
          produtos.flatMap((produto) => obterTamanhosProduto(produto))
        ),
      ].sort(),
    [produtos]
  );

  const produtosFiltrados = produtos.filter((produto) => {
    const tamanhos = obterTamanhosProduto(produto);
    const cores = obterCoresProduto(produto);
    const stockTotal = calcularStockTotal(produto);

    const termoPesquisa = pesquisa.trim().toLowerCase();

    const correspondePesquisa = termoPesquisa
      ? produto.name.toLowerCase().includes(termoPesquisa) ||
        (produto.brand || "").toLowerCase().includes(termoPesquisa) ||
        cores.some((cor) => cor.toLowerCase().includes(termoPesquisa)) ||
        tamanhos.some((tamanho) =>
          tamanho.toLowerCase().includes(termoPesquisa)
        )
      : true;

    const correspondeCategoria = categoriaFiltro
      ? produto.category?.name === categoriaFiltro
      : true;

    const correspondeTamanho = tamanhoFiltro
      ? tamanhos.includes(tamanhoFiltro)
      : true;

    const correspondeEstado = estadoFiltro
      ? produto.condition === estadoFiltro
      : true;

    let correspondeStock = true;

    if (stockFiltro === "disponivel") {
      correspondeStock = stockTotal > 2;
    } else if (stockFiltro === "baixo") {
      correspondeStock = stockTotal > 0 && stockTotal <= 2;
    } else if (stockFiltro === "esgotado") {
      correspondeStock = stockTotal <= 0;
    }

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeTamanho &&
      correspondeEstado &&
      correspondeStock
    );
  });

  function apagarProduto(id) {
    if (!window.confirm("Tem a certeza que quer apagar este produto?")) {
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

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1>Os Meus Produtos</h1>
          <p className="text-muted mb-0">
            Gere os produtos e o stock de cada tamanho e cor.
          </p>
        </div>

        <Link
          className="btn btn-primary align-self-start"
          to="/vendedor/adicionar-produto"
        >
          + Adicionar Produto
        </Link>
      </div>

      <div className="mb-4 row g-2 align-items-center">
        <div className="col-lg-4 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome, marca, tamanho ou cor..."
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
          />
        </div>

        <div className="col-lg-2 col-md-3">
          <select
            className="form-select"
            value={categoriaFiltro}
            onChange={(event) => setCategoriaFiltro(event.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categoriasDisponiveis.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-3">
          <select
            className="form-select"
            value={tamanhoFiltro}
            onChange={(event) => setTamanhoFiltro(event.target.value)}
          >
            <option value="">Todos os Tamanhos</option>
            {tamanhosDisponiveis.map((tamanho) => (
              <option key={tamanho} value={tamanho}>
                {tamanho}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-3">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value)}
          >
            <option value="">Todos os Estados</option>
            <option value="Novo">Novo</option>
            <option value="Usado - Como Novo">Usado - Como Novo</option>
            <option value="Usado - Bom Estado">Usado - Bom Estado</option>
          </select>
        </div>

        <div className="col-lg-2 col-md-3">
          <select
            className="form-select"
            value={stockFiltro}
            onChange={(event) => setStockFiltro(event.target.value)}
          >
            <option value="">Todo o Stock</option>
            <option value="disponivel">Disponível</option>
            <option value="baixo">Stock baixo</option>
            <option value="esgotado">Esgotado</option>
          </select>
        </div>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {!erro && !carregando && produtosFiltrados.length === 0 && (
        <div className="alert alert-info">
          Ainda não existem produtos para mostrar com estes filtros.
        </div>
      )}

      {carregando ? (
        <div className="alert alert-secondary">A carregar produtos...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Opções</th>
                <th>Preço</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Ações</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map((produto) => {
                const stockTotal = calcularStockTotal(produto);
                const tamanhos = obterTamanhosProduto(produto);
                const cores = obterCoresProduto(produto);

                return (
                  <tr
                    key={produto.id}
                    className={stockTotal <= 0 ? "table-danger" : ""}
                  >
                    <td>
                      <img
                        src={
                          produto.image || "/images/produtos/sem-imagem.jpg"
                        }
                        alt={produto.name}
                        className="rounded"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          filter: stockTotal <= 0 ? "grayscale(80%)" : "none",
                        }}
                      />
                    </td>

                    <td>
                      <strong>{produto.name}</strong>
                      <div className="text-muted">
                        {produto.brand || "Sem marca"}
                      </div>
                    </td>

                    <td>{produto.category?.name || "Sem categoria"}</td>

                    <td>
                      <div className="fw-semibold">
                        {obterResumoVariantes(produto)}
                      </div>
                      <div className="text-muted small">
                        Tamanhos: {tamanhos.join(", ") || "—"}
                      </div>
                      <div className="text-muted small">
                        Cores: {cores.join(", ") || "—"}
                      </div>
                    </td>

                    <td>{Number(produto.price).toFixed(2)} €</td>

                    <td>{mostrarEstadoStock(produto)}</td>

                    <td>{produto.condition}</td>

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

                    <td>
                      {produto.createdAt
                        ? new Date(produto.createdAt).toLocaleDateString("pt-PT")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProdutosVendedor;
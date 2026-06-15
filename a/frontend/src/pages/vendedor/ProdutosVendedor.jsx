import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

function calcularStockTotal(produto) {
  const variantes = produto.productVariants || [];

  if (variantes.length > 0) {
    return variantes.reduce(
      (total, variante) => total + Number(variante.stock || 0),
      0
    );
  }

  return Number(produto.stock || 0);
}

function obterTamanhos(produto) {
  const variantes = produto.productVariants || [];

  if (variantes.length === 0) {
    return produto.size || "—";
  }

  return [...new Set(variantes.map((variante) => variante.size))].join(", ");
}

function ProdutosVendedor() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tamanhoFiltro, setTamanhoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const sellerId = getSellerId();

  const carregarProdutos = useCallback(() => {
    setCarregando(true);

    api
      .get(`/produtos/listar/vendedor/${sellerId}`)
      .then((response) => {
        if (response.data.success) {
          setProdutos(response.data.data);
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

  const produtosFiltrados = produtos.filter((produto) => {
    const variantes = produto.productVariants || [];

    const correspondePesquisa =
      produto.name.toLowerCase().includes(pesquisa.toLowerCase()) ||
      (produto.brand || "").toLowerCase().includes(pesquisa.toLowerCase());

    const correspondeCategoria = categoriaFiltro
      ? produto.category?.name === categoriaFiltro
      : true;

    const correspondeTamanho = tamanhoFiltro
      ? produto.size === tamanhoFiltro ||
        variantes.some((variante) => variante.size === tamanhoFiltro)
      : true;

    const correspondeEstado = estadoFiltro
      ? produto.condition === estadoFiltro
      : true;

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeTamanho &&
      correspondeEstado
    );
  });

  function apagarProduto(id) {
    if (!window.confirm("Tem a certeza que quer apagar este produto?")) {
      return;
    }

    api
      .delete(`/produtos/apagar/${id}`)
      .then((response) => {
        if (response.data.success) {
          carregarProdutos();
        } else {
          alert("Não foi possível apagar o produto.");
        }
      })
      .catch(() => {
        alert("Erro ao ligar ao servidor.");
      });
  }

  function mostrarEstadoStock(produto) {
    const stockTotal = calcularStockTotal(produto);

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

    return <span className="badge bg-success">Stock: {stockTotal}</span>;
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1>Os Meus Produtos</h1>
          <p className="text-muted">
            Gere todos os produtos que publicaste na plataforma.
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
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome ou marca..."
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={categoriaFiltro}
            onChange={(event) => setCategoriaFiltro(event.target.value)}
          >
            <option value="">Todas as Categorias</option>
            <option value="T-shirts">T-shirts</option>
            <option value="Calças">Calças</option>
            <option value="Casacos">Casacos</option>
            <option value="Vestidos">Vestidos</option>
            <option value="Sapatilhas">Sapatilhas</option>
            <option value="Acessórios">Acessórios</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={tamanhoFiltro}
            onChange={(event) => setTamanhoFiltro(event.target.value)}
          >
            <option value="">Todos os Tamanhos</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>
        </div>

        <div className="col-md-2">
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
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {!erro && !carregando && produtosFiltrados.length === 0 && (
        <div className="alert alert-info">
          Ainda não existem produtos para mostrar.
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
                <th>Nome</th>
                <th>Categoria</th>
                <th>Tamanho</th>
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

                    <td>
                      {produto.category
                        ? produto.category.name
                        : "Sem categoria"}
                    </td>

                    <td>{obterTamanhos(produto)}</td>

                    <td>{Number(produto.price).toFixed(2)} €</td>

                    <td>{mostrarEstadoStock(produto)}</td>

                    <td>{produto.condition}</td>

                    <td>
                      <Link
                        className="btn btn-sm btn-outline-primary me-2"
                        to={`/vendedor/editar-produto/${produto.id}`}
                      >
                        Editar
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => apagarProduto(produto.id)}
                      >
                        Apagar
                      </button>
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

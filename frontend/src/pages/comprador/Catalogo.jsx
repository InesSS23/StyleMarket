import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";

function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [estado, setEstado] = useState("");
  const [erro, setErro] = useState("");

  function carregarProdutos() {
    api
      .get("/produtos/listar")
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
      });
  }

  useEffect(() => {
    const timer = setTimeout(carregarProdutos, 0);

    return () => clearTimeout(timer);
  }, []);

  function limparFiltros() {
    setPesquisa("");
    setCategoria("");
    setTamanho("");
    setEstado("");
  }

  const categorias = [
    ...new Set(
      produtos
        .filter((produto) => produto.category)
        .map((produto) => produto.category.name)
    ),
  ];

  const tamanhos = [
    ...new Set(
      produtos.flatMap((produto) => {
        const variantes = produto.productVariants || [];

        if (variantes.length > 0) {
          return variantes.map((variante) => variante.size);
        }

        return produto.size ? [produto.size] : [];
      })
    ),
  ];

  const estados = [
    ...new Set(
      produtos
        .map((produto) => produto.condition)
        .filter(Boolean)
    ),
  ];

  const produtosFiltrados = produtos.filter((produto) => {
    const variantes = produto.productVariants || [];

    const correspondePesquisa = produto.name
      .toLowerCase()
      .includes(pesquisa.toLowerCase());

    const correspondeCategoria =
      categoria === "" ||
      produto.category?.name === categoria;

    const correspondeTamanho =
      tamanho === "" ||
      produto.size === tamanho ||
      variantes.some((variante) => variante.size === tamanho);

    const correspondeEstado =
      estado === "" ||
      produto.condition === estado;

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeTamanho &&
      correspondeEstado
    );
  });

  return (
    <div className="catalog-page bg-light min-vh-100 py-5">
      <div className="container">
        <div className="catalog-header card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className="badge bg-primary-subtle text-primary mb-3">
                  Catálogo
                </span>

                <h1 className="fw-bold mb-2">
                  Encontra a tua próxima peça
                </h1>

                <p className="text-muted mb-0">
                  Explora roupas disponíveis na StyleMarket, filtra por
                  categoria, tamanho e estado.
                </p>
              </div>

              <div className="col-lg-5">
                <div className="catalog-search-box">
                  <label className="form-label fw-medium">
                    Pesquisar
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Pesquisar produto..."
                    value={pesquisa}
                    onChange={(event) =>
                      setPesquisa(event.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {erro && (
          <div className="alert alert-danger">
            {erro}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm catalog-filter-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">
                    Filtros
                  </h5>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={limparFiltros}
                  >
                    Limpar
                  </button>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Categoria
                  </label>

                  <select
                    className="form-select"
                    value={categoria}
                    onChange={(event) =>
                      setCategoria(event.target.value)
                    }
                  >
                    <option value="">
                      Todas
                    </option>

                    {categorias.map((item) => (
                      <option
                        value={item}
                        key={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Tamanho
                  </label>

                  <select
                    className="form-select"
                    value={tamanho}
                    onChange={(event) =>
                      setTamanho(event.target.value)
                    }
                  >
                    <option value="">
                      Todos
                    </option>

                    {tamanhos.map((item) => (
                      <option
                        value={item}
                        key={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label fw-medium">
                    Estado
                  </label>

                  <select
                    className="form-select"
                    value={estado}
                    onChange={(event) =>
                      setEstado(event.target.value)
                    }
                  >
                    <option value="">
                      Todos
                    </option>

                    {estados.map((item) => (
                      <option
                        value={item}
                        key={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h4 className="fw-bold mb-1">
                  Produtos disponíveis
                </h4>

                <p className="text-muted mb-0">
                  {produtosFiltrados.length}{" "}
                  {produtosFiltrados.length === 1
                    ? "produto encontrado"
                    : "produtos encontrados"}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={carregarProdutos}
              >
                Atualizar catálogo
              </button>
            </div>

            {!erro && produtosFiltrados.length === 0 && (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <h4 className="fw-bold mb-2">
                    Nenhum produto encontrado
                  </h4>

                  <p className="text-muted mb-4">
                    Experimenta alterar os filtros ou limpar a pesquisa.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={limparFiltros}
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}

            <div className="row g-4">
              {produtosFiltrados.map((produto) => (
                <div
                  className="col-md-6 col-xl-4"
                  key={produto.id}
                >
                  <ProductCard produto={produto} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalogo;
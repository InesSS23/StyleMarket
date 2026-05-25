import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";

function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  function carregarProdutos() {
    api
      .get("/produtos/listar")
      .then((response) => {
        if (response.data.success) {
          setProdutos(response.data.data);
        } else {
          setErro("Não foi possível carregar os produtos.");
        }
      })
      .catch(() => {
        setErro("Erro ao ligar ao servidor.");
      });
  }

  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1>Catálogo</h1>
          <p className="text-muted">
            Explora as roupas disponíveis na StyleMarket.
          </p>
        </div>

        <div className="catalog-search">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar produto..."
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
          />
        </div>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {!erro && produtosFiltrados.length === 0 && (
        <div className="alert alert-info">
          Ainda não existem produtos para mostrar.
        </div>
      )}

      <div className="row g-4">
        {produtosFiltrados.map((produto) => (
          <div className="col-sm-6 col-lg-4" key={produto.id}>
            <ProductCard produto={produto} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
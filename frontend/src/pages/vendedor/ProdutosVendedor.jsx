import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

function ProdutosVendedor() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tamanhoFiltro, setTamanhoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const sellerId = getSellerId();

  // 💡 Função auxiliar para formatar a data que vem do Sequelize (createdAt)
  const formatarData = (dataString) => {
    if (!dataString) return "---";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  function carregarProdutos() {
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
  }

  useEffect(() => {
    carregarProdutos();
  }, [sellerId]);

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.name.toLowerCase().includes(pesquisa.toLowerCase()) &&

      (categoriaFiltro
        ? produto.category?.name === categoriaFiltro
        : true) &&

      (tamanhoFiltro
        ? produto.size === tamanhoFiltro
        : true) &&

      (estadoFiltro
        ? produto.condition === estadoFiltro
        : true)
  );

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
       
      {/* FILTROS */}
      <div className="mb-4 row g-2 align-items-center">
        {/* Pesquisa */}
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome ou marca..."
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
          />
        </div> 

        {/* Categoria */}
        <div className="col-md-2">
          <select
            className="form-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Calças">Calças</option>
            <option value="Casacos">Casacos</option>
            <option value="Vestidos">Vestidos</option>
            <option value="Saias">Saias</option>
            <option value="Acessórios">Acessórios</option>
          </select>
        </div>

        {/* Tamanho */}
        <div className="col-md-2">
          <select
            className="form-select"
            value={tamanhoFiltro}
            onChange={(e) => setTamanhoFiltro(e.target.value)}
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

        {/* Estado */}
        <div className="col-md-2">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos os Estados</option>
            <option value="Novo">Novo</option>
            <option value="Usado - Como Novo">Usado - Como Novo</option>
            <option value="Usado - Bom Estado">Usado - Bom Estado</option>
          </select>
        </div>
      </div>

      {erro && (
        <div className="alert alert-danger">
          {erro}
        </div>
      )}

      {!erro && !carregando && produtosFiltrados.length === 0 && (
        <div className="alert alert-info">
          Ainda não existem produtos para mostrar.
        </div>
      )}

      {carregando ? (
        <div className="alert alert-secondary">
          A carregar produtos...
        </div>
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
                <th>Data de Inserção</th> {/* Mudado para antes de Ações */}
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>
                    <img
                      src={produto.image || "/images/produtos/sem-imagem.jpg"}
                      alt={produto.name}
                      className="rounded"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
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
                    {produto.category ? produto.category.name : "Sem categoria"}
                  </td>

                  <td>{produto.size}</td>

                  <td>
                    {Number(produto.price).toFixed(2)} €
                  </td>

                  <td>{produto.stock}</td>

                  <td>{produto.condition}</td>

                  {/* 💡 Exibe a data formatada corretamente usando o createdAt do Sequelize */}
                  <td className="text-muted small">
                    {formatarData(produto.createdAt)}
                  </td>

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProdutosVendedor;
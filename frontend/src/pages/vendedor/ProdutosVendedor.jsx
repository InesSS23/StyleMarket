import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";
// Importação dos ícones do Lucide React
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Calendar 
} from "lucide-react";

function ProdutosVendedor() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tamanhoFiltro, setTamanhoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const sellerId = getSellerId();

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
      (categoriaFiltro ? produto.category?.name === categoriaFiltro : true) &&
      (tamanhoFiltro ? produto.size === tamanhoFiltro : true) &&
      (estadoFiltro ? produto.condition === estadoFiltro : true)
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

  // Função auxiliar para definir a cor da badge do Stock dinamicamente
  const getStockBadgeColor = (stock) => {
    if (stock === 0) return "bg-danger-subtle text-danger";
    if (stock <= 5) return "bg-warning-subtle text-warning-emphasis";
    return "bg-success-subtle text-success";
  };

  return (
    <div className="container py-5">
      {/* CABEÇALHO */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Os Meus Produtos</h1>
          <p className="text-muted mb-0">
            Gere todos os produtos que publicaste na plataforma.
          </p>
        </div>

        <Link
          className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-medium"
          to="/vendedor/adicionar-produto"
        >
          <Plus size={18} /> Adicionar Produto
        </Link>
      </div>
        
      {/* SECÇÃO DE FILTROS ESTILIZADA (CONFORME A IMAGEM) */}
      <div className="card border-0 shadow-sm p-3 mb-3 bg-white rounded-4">
        <div className="row g-2 align-items-center">
          {/* Pesquisa com Ícone de Lupa */}
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Pesquisar por nome ou marca..."
                value={pesquisa}
                onChange={(event) => setPesquisa(event.target.value)}
              />
            </div>
          </div> 

          {/* Categoria */}
          <div className="col-md-2">
            <select
              className="form-select text-muted"
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
              className="form-select text-muted"
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
          <div className="col-md-3">
            <select
              className="form-select text-muted"
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
      </div>

      {/* CONTADOR DE PRODUTOS */}
      <div className="text-muted small mb-3 ps-1">
        A mostrar <strong className="text-dark">{produtosFiltrados.length}</strong> produtos
      </div>

      {/* MENSAGENS DE FEEDBACK */}
      {erro && <div className="alert alert-danger rounded-3">{erro}</div>}

      {!erro && !carregando && produtosFiltrados.length === 0 && (
        <div className="alert alert-info rounded-3">
          Ainda não existem produtos com os filtros selecionados.
        </div>
      )}

      {/* TABELA DE PRODUTOS */}
      {carregando ? (
        <div className="alert alert-secondary rounded-3 text-center py-4">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          A carregar produtos...
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase fs-7 text-muted border-bottom">
                <tr>
                  <th className="ps-4 py-3">Imagem</th>
                  <th className="py-3">Nome</th>
                  <th className="py-3">Categoria</th>
                  <th className="py-3">Tamanho</th>
                  <th className="py-3">Preço</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3">Ações</th>
                  <th className="pe-4 py-3 text-end"><Calendar size={14} className="me-1" /> Data</th>
                </tr>
              </thead>

              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id}>
                    {/* Imagem Arredondada */}
                    <td className="ps-4">
                      <img
                        src={produto.image || "/images/produtos/sem-imagem.jpg"}
                        alt={produto.name}
                        className="rounded-3 border"
                        style={{
                          width: 54,
                          height: 54,
                          objectFit: "cover",
                        }}
                      />
                    </td>

                    {/* Nome e Marca */}
                    <td>
                      <span className="text-dark fw-semibold d-block fs-6 mb-0">{produto.name}</span>
                      <small className="text-muted fs-7">{produto.brand || "Sem marca"}</small>
                    </td>

                    {/* Categoria */}
                    <td className="text-secondary">
                      {produto.category ? produto.category.name : "Sem categoria"}
                    </td>

                    {/* Tamanho */}
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1 fs-7">
                        {produto.size}
                      </span>
                    </td>

                    {/* Preço Negrito */}
                    <td className="fw-bold text-dark">
                      {Number(produto.price).toFixed(2)}€
                    </td>

                    {/* Stock em Badge Colorida */}
                    <td>
                      <span className={`badge px-2 py-1 fs-7 ${getStockBadgeColor(produto.stock)}`}>
                        {produto.stock} un.
                      </span>
                    </td>

                    {/* Estado em Badge Verde */}
                    <td>
                      <span className="badge bg-success-subtle text-success px-2 py-1 fs-7">
                        {produto.condition}
                      </span>
                    </td>

                    {/* Botões de Ação com Ícones */}
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 px-2.5 py-1"
                          to={`/vendedor/editar-produto/${produto.id}`}
                        >
                          <Pencil size={13} /> Editar
                        </Link>

                        <button
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 px-2.5 py-1"
                          onClick={() => apagarProduto(produto.id)}
                        >
                          <Trash2 size={13} /> Apagar
                        </button>
                      </div>
                    </td>

                    {/* Data Alinhada à Direita */}
                    <td className="pe-4 text-end text-muted small">
                      {produto.date || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProdutosVendedor;
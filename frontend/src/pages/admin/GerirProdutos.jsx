import { useEffect, useState } from "react";
import api from "../../services/api";

function GerirProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [vendedorSelecionado, setVendedorSelecionado] = useState("");
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  function carregarProdutos() {
    setCarregando(true);

    api
      .get("/produtos/listar")
      .then((response) => {
        if (response.data.success) {
          setProdutos(response.data.data);
        }
      })
      .catch(() => {
        setErro("Erro ao carregar produtos.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const texto = pesquisa.trim().toLowerCase();
    const categoria = categoriaSelecionada.toLowerCase();
    const vendedor = vendedorSelecionado.toLowerCase();
    const estado = estadoSelecionado.toLowerCase();

    const correspondePesquisa =
      !texto ||
      produto.name?.toLowerCase().includes(texto) ||
      produto.brand?.toLowerCase().includes(texto);

    const correspondeCategoria =
      !categoria ||
      produto.category?.name?.toLowerCase() === categoria;

    const vendedorNome =
      produto.seller?.storeName || produto.seller?.name || "";
    const correspondeVendedor =
      !vendedor ||
      vendedorNome.toLowerCase() === vendedor;

    const correspondeEstado =
      !estado ||
      produto.condition?.toLowerCase() === estado;

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeVendedor &&
      correspondeEstado
    );
  });

  function imagemProduto(produto) {
    if (produto.image) return produto.image;

    return "/images/produtos/tshirt-branca.jpg";
  }

  function formatarPreco(valor) {
    return `${Number(valor || 0).toFixed(2)}€`;
  }

  function estadoClass(estado) {
    if (estado === "Novo") return "admin-badge admin-badge--green";
    if (estado === "Usado - Como Novo") return "admin-badge admin-badge--blue";
    if (estado === "Usado - Bom Estado") return "admin-badge admin-badge--yellow";

    return "admin-badge admin-badge--gray";
  }

  function apagarProduto(id) {
    if (!window.confirm("Tens a certeza que queres apagar este produto?")) return;

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
        alert("Erro ao apagar produto.");
      });
  }

  function verProduto(produto) {
    alert(
      `Produto: ${produto.name}\nMarca: ${produto.brand || "Sem marca"}\nPreço: ${formatarPreco(
        produto.price
      )}\nStock: ${produto.stock}`
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Produtos</h1>
        <p>Gere todos os produtos publicados na plataforma.</p>
      </div>

      <div className="admin-products-filter-card">
        <input
          className="admin-search-input"
          placeholder="Pesquisar por nome ou marca..."
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
        />

        <select
          className="admin-select"
          value={categoriaSelecionada}
          onChange={(event) => setCategoriaSelecionada(event.target.value)}
        >
          <option value="">Todas as Categorias</option>
          <option value="t-shirts">T-shirts</option>
          <option value="casacos">Casacos</option>
          <option value="calças">Calças</option>
          <option value="vestidos">Vestidos</option>
          <option value="sapatilhas">Sapatilhas</option>
          <option value="acessórios">Acessórios</option>
        </select>

        <select
          className="admin-select"
          value={vendedorSelecionado}
          onChange={(event) => setVendedorSelecionado(event.target.value)}
        >
          <option value="">Todos os Vendedores</option>
          {Array.from(
            new Set(
              produtos
                .map((produto) =>
                  (produto.seller?.storeName || produto.seller?.name || "")
                    .trim()
                )
                .filter(Boolean)
            )
          ).map((vendedor) => (
            <option key={vendedor} value={vendedor.toLowerCase()}>
              {vendedor}
            </option>
          ))}
        </select>

        <select
          className="admin-select"
          value={estadoSelecionado}
          onChange={(event) => setEstadoSelecionado(event.target.value)}
        >
          <option value="">Todos os Estados</option>
          <option value="novo">Novo</option>
          <option value="usado - como novo">Usado - Como Novo</option>
          <option value="usado - bom estado">Usado - Bom Estado</option>
        </select>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <p className="admin-results-text">
        A mostrar {produtosFiltrados.length} produtos
      </p>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Vendedor</th>
              <th>Preço</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  A carregar produtos...
                </td>
              </tr>
            )}

            {!carregando &&
              produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>#{produto.id}</td>

                  <td>
                    <div className="admin-product-cell">
                      <img src={imagemProduto(produto)} alt={produto.name} />
                      <strong>{produto.name}</strong>
                    </div>
                  </td>

                  <td>{produto.category?.name || "Sem categoria"}</td>

                  <td>
                    {produto.seller?.storeName ||
                      produto.seller?.name ||
                      "Sem vendedor"}
                  </td>

                  <td>
                    <strong>{formatarPreco(produto.price)}</strong>
                  </td>

                  <td>{produto.stock}</td>

                  <td>
                    <span className={estadoClass(produto.condition)}>
                      {produto.condition}
                    </span>
                  </td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action admin-action--blue"
                        onClick={() => verProduto(produto)}
                      >
                        👁
                      </button>

                      <button
                        className="admin-action admin-action--dark"
                        onClick={() =>
                          alert("A edição de produtos pode ser feita no painel do vendedor.")
                        }
                      >
                        ✎
                      </button>

                      <button
                        className="admin-action admin-action--red"
                        onClick={() => apagarProduto(produto.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!carregando && produtosFiltrados.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  Não existem produtos que correspondam aos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default GerirProdutos;
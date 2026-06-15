import { useEffect, useState } from "react";
import api from "../../services/api";

function GerirProdutos() {
  const [produtos, setProdutos] = useState([]);
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
        />

        <select className="admin-select">
          <option>Todas as Categorias</option>
          <option>T-shirts</option>
          <option>Casacos</option>
          <option>Calças</option>
          <option>Vestidos</option>
          <option>Sapatilhas</option>
          <option>Acessórios</option>
        </select>

        <select className="admin-select">
          <option>Todos os Vendedores</option>
          <option>João Silva</option>
          <option>Maria Santos</option>
          <option>Ana Ferreira</option>
        </select>

        <select className="admin-select">
          <option>Todos os Estados</option>
          <option>Novo</option>
          <option>Usado - Como Novo</option>
          <option>Usado - Bom Estado</option>
        </select>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <p className="admin-results-text">
        A mostrar {produtos.length} produtos
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
              produtos.map((produto) => (
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

            {!carregando && produtos.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  Ainda não existem produtos registados.
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
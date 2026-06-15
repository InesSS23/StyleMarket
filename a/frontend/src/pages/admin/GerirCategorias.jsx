import { useEffect, useState } from "react";
import api from "../../services/api";

function GerirCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarCategorias();
    carregarProdutos();
  }, []);

  function carregarCategorias() {
    setCarregando(true);

    api
      .get("/categorias/listar")
      .then((response) => {
        if (response.data.success) {
          setCategorias(response.data.data);
        }
      })
      .catch(() => {
        setErro("Erro ao carregar categorias.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  function carregarProdutos() {
    api
      .get("/produtos/listar")
      .then((response) => {
        if (response.data.success) {
          setProdutos(response.data.data);
        }
      })
      .catch(() => {
        setProdutos([]);
      });
  }

  function contarProdutosDaCategoria(categoria) {
    return produtos.filter(
      (produto) =>
        produto.categoryId === categoria.id ||
        produto.category?.id === categoria.id ||
        produto.category?.name === categoria.name
    ).length;
  }

  function obterIcone(nome) {
    const nomeFormatado = nome.toLowerCase();

    if (nomeFormatado.includes("t-shirt") || nomeFormatado.includes("shirt")) return "👕";
    if (nomeFormatado.includes("casaco")) return "🧥";
    if (nomeFormatado.includes("calça")) return "👖";
    if (nomeFormatado.includes("vestido")) return "👗";
    if (nomeFormatado.includes("sapatilha")) return "👟";
    if (nomeFormatado.includes("acessório") || nomeFormatado.includes("acessorio")) return "🎒";

    return "🏷️";
  }

  function adicionarCategoria() {
    const nome = window.prompt("Nome da nova categoria:");

    if (!nome || !nome.trim()) return;

    api
      .post("/categorias/criar", { name: nome.trim() })
      .then((response) => {
        if (response.data.success) {
          carregarCategorias();
        } else {
          alert("Não foi possível criar a categoria.");
        }
      })
      .catch(() => {
        alert("Erro ao criar categoria.");
      });
  }

  function editarCategoria(categoria) {
    const novoNome = window.prompt("Editar nome da categoria:", categoria.name);

    if (!novoNome || !novoNome.trim()) return;

    api
      .put(`/categorias/atualizar/${categoria.id}`, { name: novoNome.trim() })
      .then((response) => {
        if (response.data.success) {
          carregarCategorias();
        } else {
          alert("Não foi possível atualizar a categoria.");
        }
      })
      .catch(() => {
        alert("Erro ao atualizar categoria.");
      });
  }

  function apagarCategoria(id) {
    if (!window.confirm("Tens a certeza que queres apagar esta categoria?")) return;

    api
      .delete(`/categorias/apagar/${id}`)
      .then((response) => {
        if (response.data.success) {
          carregarCategorias();
        } else {
          alert("Não foi possível apagar a categoria.");
        }
      })
      .catch(() => {
        alert("Erro ao apagar categoria.");
      });
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header admin-page-header-row">
        <div>
          <h1>Gestão de Categorias</h1>
          <p>Cria e gere as categorias de produtos da plataforma.</p>
        </div>

        <button className="admin-primary-button" onClick={adicionarCategoria}>
          + Adicionar Categoria
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ícone</th>
              <th>Nome</th>
              <th>Produtos</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  A carregar categorias...
                </td>
              </tr>
            )}

            {!carregando &&
              categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>#{categoria.id}</td>
                  <td className="admin-category-icon">{obterIcone(categoria.name)}</td>
                  <td>
                    <strong>{categoria.name}</strong>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--blue">
                      {contarProdutosDaCategoria(categoria)} produtos
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action admin-action--blue"
                        onClick={() => editarCategoria(categoria)}
                      >
                        ✎
                      </button>

                      <button
                        className="admin-action admin-action--red"
                        onClick={() => apagarCategoria(categoria.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!carregando && categorias.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Ainda não existem categorias registadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default GerirCategorias;
import { useEffect, useState } from "react";
import api from "../../services/api";

function GerirCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function carregarCategorias() {
    setCarregando(true);
    setErro("");

    api
      .get("/categorias/listar")
      .then((response) => {
        if (response.data.success) {
          setCategorias(response.data.data);
        } else {
          setErro("Erro ao carregar categorias.");
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

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarCategorias();
      carregarProdutos();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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

    if (
      nomeFormatado.includes("t-shirt") ||
      nomeFormatado.includes("shirt") ||
      nomeFormatado.includes("camisola") ||
      nomeFormatado.includes("blusa")
    ) {
      return "👕";
    }

    if (nomeFormatado.includes("casaco")) {
      return "🧥";
    }

    if (nomeFormatado.includes("calça")) {
      return "👖";
    }

    if (
      nomeFormatado.includes("vestido") ||
      nomeFormatado.includes("saia")
    ) {
      return "👗";
    }

    if (nomeFormatado.includes("sapatilha")) {
      return "👟";
    }

    if (
      nomeFormatado.includes("acessório") ||
      nomeFormatado.includes("acessorio")
    ) {
      return "🎒";
    }

    return "🏷️";
  }

  function adicionarCategoria() {
    const nome = window.prompt("Nome da nova categoria:");
    const nomeFinal = nome?.trim();

    if (!nomeFinal) {
      return;
    }

    const categoriaExistente = categorias.some(
      (categoria) =>
        categoria.name.trim().toLowerCase() ===
        nomeFinal.toLowerCase()
    );

    if (categoriaExistente) {
      window.alert("Já existe uma categoria com esse nome.");
      return;
    }

    api
      .post("/categorias/criar", { name: nomeFinal })
      .then((response) => {
        if (response.data.success) {
          setCategorias((listaAtual) => [
            ...listaAtual,
            response.data.data,
          ]);
          setErro("");
        } else {
          window.alert("Não foi possível criar a categoria.");
        }
      })
      .catch((error) => {
        window.alert(
          error.response?.data?.message ||
            "Erro ao criar categoria."
        );
      });
  }

  function apagarCategoria(categoria) {
    const numeroProdutos = contarProdutosDaCategoria(categoria);

    if (numeroProdutos > 0) {
      window.alert(
        `Não podes apagar esta categoria porque tem ${numeroProdutos} produto(s) associado(s).`
      );
      return;
    }

    if (
      !window.confirm(
        `Tens a certeza que queres apagar a categoria ${categoria.name}?`
      )
    ) {
      return;
    }

    api
      .delete(`/categorias/apagar/${categoria.id}`)
      .then((response) => {
        if (response.data.success) {
          setCategorias((listaAtual) =>
            listaAtual.filter((item) => item.id !== categoria.id)
          );
          setErro("");
        } else {
          window.alert("Não foi possível apagar a categoria.");
        }
      })
      .catch((error) => {
        window.alert(
          error.response?.data?.message ||
            "Erro ao apagar categoria."
        );
      });
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header admin-page-header-row">
        <div>
          <h1>Gestão de Categorias</h1>
          <p>Adiciona e remove categorias de produtos.</p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={adicionarCategoria}
        >
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

                  <td className="admin-category-icon">
                    {obterIcone(categoria.name)}
                  </td>

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
                        type="button"
                        className="admin-action admin-action--red"
                        title="Apagar categoria"
                        onClick={() => apagarCategoria(categoria)}
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
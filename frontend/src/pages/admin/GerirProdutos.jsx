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
    let componenteAtivo = true;

    api
      .get("/produtos/listar")
      .then((response) => {
        if (!componenteAtivo) {
          return;
        }

        if (response.data.success) {
          setProdutos(response.data.data);
          setErro("");
        } else {
          setErro("Erro ao carregar produtos.");
        }
      })
      .catch(() => {
        if (componenteAtivo) {
          setErro("Erro ao carregar produtos.");
        }
      })
      .finally(() => {
        if (componenteAtivo) {
          setCarregando(false);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, []);

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
      !vendedor || vendedorNome.toLowerCase() === vendedor;

    const correspondeEstado =
      !estado || produto.condition?.toLowerCase() === estado;

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeVendedor &&
      correspondeEstado
    );
  });

  const categorias = Array.from(
    new Set(
      produtos
        .map((produto) => produto.category?.name)
        .filter(Boolean)
    )
  );

  const vendedores = Array.from(
    new Set(
      produtos
        .map(
          (produto) =>
            produto.seller?.storeName || produto.seller?.name
        )
        .filter(Boolean)
    )
  );

  function imagemProduto(produto) {
    if (produto.productImages?.length > 0) {
      const imagensOrdenadas = [...produto.productImages].sort(
        (a, b) => Number(a.position || 0) - Number(b.position || 0)
      );

      if (imagensOrdenadas[0]?.image) {
        return imagensOrdenadas[0].image;
      }
    }

    if (produto.image) {
      return produto.image;
    }

    return "/images/produtos/sem-imagem.jpg";
  }

  function calcularStock(produto) {
    if (produto.productVariants?.length > 0) {
      return produto.productVariants.reduce(
        (total, variante) =>
          total + Number(variante.stock || 0),
        0
      );
    }

    return Number(produto.stock || 0);
  }

  function formatarPreco(valor) {
    return `${Number(valor || 0).toFixed(2)} €`;
  }

  function estadoClass(estado) {
    if (estado === "Novo") {
      return "admin-badge admin-badge--green";
    }

    if (estado === "Usado - Como Novo") {
      return "admin-badge admin-badge--blue";
    }

    if (estado === "Usado - Bom Estado") {
      return "admin-badge admin-badge--yellow";
    }

    return "admin-badge admin-badge--gray";
  }

  function apagarProduto(produto) {
    if (
      !window.confirm(
        `Tens a certeza que queres apagar o produto ${produto.name}?`
      )
    ) {
      return;
    }

    api
      .delete(`/produtos/apagar/${produto.id}`)
      .then((response) => {
        if (response.data.success) {
          setProdutos((listaAtual) =>
            listaAtual.filter((item) => item.id !== produto.id)
          );
          setErro("");
        } else {
          window.alert("Não foi possível apagar o produto.");
        }
      })
      .catch((error) => {
        window.alert(
          error.response?.data?.message ||
            "Erro ao apagar produto."
        );
      });
  }

  function verProduto(produto) {
    const variantes = produto.productVariants || [];
    const imagens = produto.productImages || [];

    window.alert(
      `Produto #${produto.id}\n` +
        `Nome: ${produto.name}\n` +
        `Marca: ${produto.brand || "Sem marca"}\n` +
        `Categoria: ${produto.category?.name || "Sem categoria"}\n` +
        `Vendedor: ${
          produto.seller?.storeName ||
          produto.seller?.name ||
          "Sem vendedor"
        }\n` +
        `Preço: ${formatarPreco(produto.price)}\n` +
        `Stock total: ${calcularStock(produto)}\n` +
        `Estado: ${produto.condition || "Não indicado"}\n` +
        `Variantes: ${variantes.length}\n` +
        `Imagens: ${imagens.length || (produto.image ? 1 : 0)}\n` +
        `Descrição: ${produto.description || "Sem descrição"}`
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Produtos</h1>
        <p>Consulta e remove produtos publicados na plataforma.</p>
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
          onChange={(event) =>
            setCategoriaSelecionada(event.target.value)
          }
        >
          <option value="">Todas as Categorias</option>

          {categorias.map((categoria) => (
            <option
              key={categoria}
              value={categoria.toLowerCase()}
            >
              {categoria}
            </option>
          ))}
        </select>

        <select
          className="admin-select"
          value={vendedorSelecionado}
          onChange={(event) =>
            setVendedorSelecionado(event.target.value)
          }
        >
          <option value="">Todos os Vendedores</option>

          {vendedores.map((vendedor) => (
            <option
              key={vendedor}
              value={vendedor.toLowerCase()}
            >
              {vendedor}
            </option>
          ))}
        </select>

        <select
          className="admin-select"
          value={estadoSelecionado}
          onChange={(event) =>
            setEstadoSelecionado(event.target.value)
          }
        >
          <option value="">Todos os Estados</option>
          <option value="novo">Novo</option>
          <option value="usado - como novo">
            Usado - Como Novo
          </option>
          <option value="usado - bom estado">
            Usado - Bom Estado
          </option>
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
                      <img
                        src={imagemProduto(produto)}
                        alt={produto.name}
                      />
                      <strong>{produto.name}</strong>
                    </div>
                  </td>

                  <td>
                    {produto.category?.name || "Sem categoria"}
                  </td>

                  <td>
                    {produto.seller?.storeName ||
                      produto.seller?.name ||
                      "Sem vendedor"}
                  </td>

                  <td>
                    <strong>{formatarPreco(produto.price)}</strong>
                  </td>

                  <td>{calcularStock(produto)}</td>

                  <td>
                    <span className={estadoClass(produto.condition)}>
                      {produto.condition || "Não indicado"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="admin-action admin-action--blue"
                        title="Ver detalhes do produto"
                        onClick={() => verProduto(produto)}
                      >
                        👁
                      </button>

                      <button
                        type="button"
                        className="admin-action admin-action--red"
                        title="Apagar produto"
                        onClick={() => apagarProduto(produto)}
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

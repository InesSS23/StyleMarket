import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/produtos/listar"),
      api.get("/categorias/listar"),
    ])
      .then(([respostaProdutos, respostaCategorias]) => {
        if (respostaProdutos.data.success) {
          setProdutos(respostaProdutos.data.data);
        }

        if (respostaCategorias.data.success) {
          setCategorias(respostaCategorias.data.data);
        }
      })
      .catch(() => {
        setErro("Erro ao carregar os dados da página inicial.");
      });
  }, []);

  function contarProdutosPorCategoria(categoriaId) {
    return produtos.filter(
      (produto) =>
        produto.categoryId === categoriaId ||
        produto.category?.id === categoriaId
    ).length;
  }

  const produtosDestaque = produtos.slice(0, 4);

  return (
    <div className="home-page">
      <section className="home-hero bg-primary text-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">
                Compre e vende roupa
              </h1>

              <p className="lead text-white-50 mb-4">
                Uma plataforma pensada em si, no seu estilo, na sua loja
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/catalogo" className="btn btn-light btn-lg px-5">
                  Ver Catálogo
                </Link>

                <Link
                  to="/registo"
                  className="btn btn-outline-light btn-lg px-5"
                >
                  Começar a Vender
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container py-3">
          <h2 className="text-center fw-bold mb-5">
            Por que escolher a StyleMarket?
          </h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="home-feature-card text-center h-100">
                <h5 className="fw-bold mb-3">Fácil de usar</h5>

                <p className="text-muted mb-0">
                  Interface simples para consultar os seus produtos, comparar atualizar o seu armário
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="home-feature-card text-center h-100">
                <h5 className="fw-bold mb-3">Compra organizada</h5>

                <p className="text-muted mb-0">
                  Carrinho, detalhes dos produtos e finalização de compra numa experiência clara
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="home-feature-card text-center h-100">
                <h5 className="fw-bold mb-3">Vende mais</h5>

                <p className="text-muted mb-0">
                  Divulgue os seus produtos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-3">
          <h2 className="text-center fw-bold mb-5">Categorias</h2>

          {categorias.length === 0 && !erro && (
            <div className="alert alert-info text-center">
              Ainda não existem categorias disponíveis.
            </div>
          )}

          <div className="home-categories-scroll d-flex flex-nowrap gap-3 overflow-auto pb-3">
            {categorias.map((categoria) => (
              <Link
                to={`/catalogo?categoria=${encodeURIComponent(
                  categoria.name
                )}`}
                className="home-category-card card flex-shrink-0 text-center text-decoration-none"
                key={categoria.id}
              >
                <div className="card-body d-flex flex-column justify-content-center">
                  <h6 className="fw-bold text-dark mb-2">
                    {categoria.name}
                  </h6>

                  <p className="text-muted small mb-0">
                    {contarProdutosPorCategoria(categoria.id)}{" "}
                    {contarProdutosPorCategoria(categoria.id) === 1
                      ? "produto"
                      : "produtos"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-1">Produtos em Destaque</h2>

              <p className="text-muted mb-0">
                Algumas peças disponíveis na plataforma.
              </p>
            </div>

            <Link to="/catalogo" className="btn btn-outline-primary">
              Ver todos
            </Link>
          </div>

          {erro && <div className="alert alert-danger">{erro}</div>}

          {!erro && produtosDestaque.length === 0 && (
            <div className="alert alert-info">
              Ainda não existem produtos em destaque.
            </div>
          )}

          <div className="row g-4">
            {produtosDestaque.map((produto) => (
              <div className="col-sm-6 col-lg-3" key={produto.id}>
                <ProductCard produto={produto} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-seller-section py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-2">Tens roupas para vender?</h2>

              <p className="text-muted mb-lg-0">
                Cria uma conta, começa a publicar os teus produtos ou compras as tuas peças na StyleMarket
              </p>
            </div>

            <div className="col-lg-4 text-lg-end">
              <Link to="/registo" className="btn btn-primary btn-lg">
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
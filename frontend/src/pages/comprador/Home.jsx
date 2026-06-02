import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");

  const categorias = [
    "T-shirts",
    "Casacos",
    "Calças",
    "Vestidos",
    "Sapatilhas",
    "Acessórios",
  ];

  useEffect(() => {
    api
      .get("/produtos/listar")
      .then((response) => {
        if (response.data.success) {
          setProdutos(response.data.data);
        } else {
          setErro("Não foi possível carregar os produtos em destaque.");
        }
      })
      .catch(() => {
        setErro("Erro ao ligar ao servidor.");
      });
  }, []);

  function contarProdutosPorCategoria(categoria) {
    return produtos.filter(
      (produto) => produto.category && produto.category.name === categoria
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
                Compra e vende roupa online
              </h1>

              <p className="lead text-white-50 mb-4">
                Uma plataforma simples para vendedores publicarem roupas e
                compradores encontrarem peças únicas.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/catalogo" className="btn btn-light btn-lg px-5">
                  Ver Catálogo
                </Link>

                <Link to="/registo" className="btn btn-outline-light btn-lg px-5">
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
                <div className="home-feature-icon mx-auto mb-3">01</div>
                <h5 className="fw-bold">Fácil de usar</h5>
                <p className="text-muted mb-0">
                  Interface simples para consultar produtos, comparar opções e
                  comprar com poucos passos.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="home-feature-card text-center h-100">
                <div className="home-feature-icon mx-auto mb-3">02</div>
                <h5 className="fw-bold">Compra organizada</h5>
                <p className="text-muted mb-0">
                  Carrinho, detalhes dos produtos e finalização de compra numa
                  experiência clara.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="home-feature-card text-center h-100">
                <div className="home-feature-icon mx-auto mb-3">03</div>
                <h5 className="fw-bold">Vende mais</h5>
                <p className="text-muted mb-0">
                  Os vendedores podem divulgar roupas e gerir os seus produtos
                  numa área própria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-3">
          <h2 className="text-center fw-bold mb-5">Categorias Populares</h2>

          <div className="row g-3">
            {categorias.map((categoria) => (
              <div className="col-6 col-md-4 col-lg-2" key={categoria}>
                <Link
                  to={`/catalogo?categoria=${categoria}`}
                  className="home-category-card card h-100 text-center text-decoration-none"
                >
                  <div className="card-body">
                    <div className="home-category-letter mx-auto mb-3">
                      {categoria.charAt(0)}
                    </div>

                    <h6 className="fw-bold text-dark mb-1">{categoria}</h6>

                    <p className="text-muted small mb-0">
                      {contarProdutosPorCategoria(categoria)} produtos
                    </p>
                  </div>
                </Link>
              </div>
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
                Cria uma conta, escolhe a opção de vendedor no registo e começa
                a publicar os teus produtos na StyleMarket.
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
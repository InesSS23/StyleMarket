import { Link } from "react-router-dom";
import { adicionarAoCarrinho } from "../utils/carrinhoUtils";

function ProductCard({ produto }) {
  function handleAdicionarCarrinho() {
    adicionarAoCarrinho(produto);
    alert("Produto adicionado ao carrinho.");
  }

  return (
    <div className="card h-100 shadow-sm product-card">
      <img
        src={produto.image || "/images/produtos/sem-imagem.jpg"}
        className="card-img-top product-image"
        alt={produto.name}
      />

      <div className="card-body d-flex flex-column">
        <span className="badge bg-light text-dark mb-2 align-self-start">
          {produto.category ? produto.category.name : "Sem categoria"}
        </span>

        <h5 className="card-title">{produto.name}</h5>

        <p className="card-text text-muted mb-1">Tamanho: {produto.size}</p>
        <p className="card-text text-muted mb-1">Cor: {produto.color}</p>

        <h5 className="text-primary mt-2">
          {Number(produto.price).toFixed(2)} €
        </h5>

        <div className="mt-auto d-grid gap-2">
          <Link to={`/produto/${produto.id}`} className="btn btn-outline-dark">
            Ver detalhes
          </Link>

          <button className="btn btn-primary" onClick={handleAdicionarCarrinho}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
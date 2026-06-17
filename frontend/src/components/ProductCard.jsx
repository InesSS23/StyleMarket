import { Link } from "react-router-dom";
import { obterImagensProduto } from "../utils/produtoUtils";

function ProductCard({ produto }) {
  const variantes = produto.productVariants || [];
  const imagemPrincipal = obterImagensProduto(produto)[0];

  const stockTotal =
    variantes.length > 0
      ? variantes.reduce(
          (total, variante) => total + Number(variante.stock || 0),
          0
        )
      : Number(produto.stock || 0);

  const esgotado = stockTotal <= 0;
  const varianteUnica = variantes.length === 1 ? variantes[0] : null;

  return (
    <div
      className={`card h-100 shadow-sm product-card ${
        esgotado ? "product-card-esgotado" : ""
      }`}
    >
      <div className="position-relative">
        <img
          src={imagemPrincipal}
          className="card-img-top product-image"
          alt={produto.name}
        />

        {esgotado && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-3">
            Esgotado
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge bg-light text-dark mb-2 align-self-start">
          {produto.category ? produto.category.name : "Sem categoria"}
        </span>

        <h5 className="card-title">{produto.name}</h5>

        {variantes.length <= 1 ? (
          <>
            <p className="card-text text-muted mb-1">
              Tamanho: {varianteUnica?.size || produto.size}
            </p>
            <p className="card-text text-muted mb-1">
              Cor: {varianteUnica?.color || produto.color}
            </p>
          </>
        ) : (
          <p className="card-text text-muted mb-1">
            Várias cores e tamanhos disponíveis
          </p>
        )}

        <h5 className="text-primary mt-2">
          {Number(produto.price).toFixed(2)} €
        </h5>

        <div className="mt-auto d-grid">
          <Link
            to={`/produto/${produto.id}`}
            className="btn btn-primary"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
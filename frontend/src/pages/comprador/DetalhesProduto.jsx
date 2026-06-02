import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import { adicionarAoCarrinho } from "../../utils/carrinhoUtils";

function DetalhesProduto() {
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("");
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");

  useEffect(() => {
    api
      .get(`/produtos/obter/${id}`)
      .then((response) => {
        if (response.data.success) {
          const produtoRecebido = response.data.data;

          setProduto(produtoRecebido);

          if (
            produtoRecebido.productVariants &&
            produtoRecebido.productVariants.length > 0
          ) {
            const primeiraComStock = produtoRecebido.productVariants.find(
              (variant) => variant.stock > 0
            );

            if (primeiraComStock) {
              setCorSelecionada(primeiraComStock.color);
              setTamanhoSelecionado(primeiraComStock.size);
            }
          }
        } else {
          setErro("Produto não encontrado.");
        }
      })
      .catch(() => {
        setErro("Erro ao carregar o produto.");
      });
  }, [id]);

  if (erro) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{erro}</div>

        <Link to="/catalogo" className="btn btn-outline-dark">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="container py-5">
        <div className="alert alert-info">A carregar produto...</div>
      </div>
    );
  }

  const variantes = produto.productVariants || [];

  const coresDisponiveis = [
    ...new Set(variantes.map((variant) => variant.color)),
  ];

  const tamanhosDaCor = variantes.filter(
    (variant) => variant.color === corSelecionada
  );

  const varianteSelecionada = variantes.find(
    (variant) =>
      variant.color === corSelecionada && variant.size === tamanhoSelecionado
  );

  const temStock = varianteSelecionada && varianteSelecionada.stock > 0;

  function handleAdicionarCarrinho() {
    if (variantes.length > 0 && !varianteSelecionada) {
      alert("Seleciona uma cor e um tamanho.");
      return;
    }

    if (variantes.length > 0 && !temStock) {
      alert("Esta opção está esgotada.");
      return;
    }

    adicionarAoCarrinho(produto, varianteSelecionada);
    alert("Produto adicionado ao carrinho.");
  }

  return (
    <div className="container py-5">
      <Link to="/catalogo" className="btn btn-outline-dark mb-4">
        Voltar ao catálogo
      </Link>

      <div className="row g-5">
        <div className="col-md-6">
          <img
            src={produto.image || "/images/produtos/sem-imagem.jpg"}
            alt={produto.name}
            className="img-fluid rounded shadow-sm detalhe-produto-imagem"
          />
        </div>

        <div className="col-md-6">
          <span className="badge bg-light text-dark mb-3">
            {produto.category ? produto.category.name : "Sem categoria"}
          </span>

          <h1 className="mb-3">{produto.name}</h1>

          <p className="text-muted">{produto.description}</p>

          <h2 className="text-primary mb-4">
            {Number(produto.price).toFixed(2)} €
          </h2>

          {variantes.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Escolhe a cor</h5>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {coresDisponiveis.map((cor) => (
                  <button
                    type="button"
                    className={
                      corSelecionada === cor
                        ? "btn btn-primary"
                        : "btn btn-outline-primary"
                    }
                    key={cor}
                    onClick={() => {
                      setCorSelecionada(cor);

                      const primeiraDaCor = variantes.find(
                        (variant) => variant.color === cor && variant.stock > 0
                      );

                      if (primeiraDaCor) {
                        setTamanhoSelecionado(primeiraDaCor.size);
                      } else {
                        setTamanhoSelecionado("");
                      }
                    }}
                  >
                    {cor}
                  </button>
                ))}
              </div>

              <h5 className="fw-bold mb-3">Escolhe o tamanho</h5>

              <div className="d-flex flex-wrap gap-2">
                {tamanhosDaCor.map((variant) => (
                  <button
                    type="button"
                    className={
                      tamanhoSelecionado === variant.size
                        ? "btn btn-dark"
                        : "btn btn-outline-dark"
                    }
                    key={variant.id}
                    disabled={variant.stock <= 0}
                    onClick={() => setTamanhoSelecionado(variant.size)}
                  >
                    {variant.size}
                    {variant.stock <= 0 && " - Esgotado"}
                  </button>
                ))}
              </div>

              {varianteSelecionada && (
                <p className="text-muted mt-3 mb-0">
                  Stock disponível: {varianteSelecionada.stock}
                </p>
              )}
            </div>
          )}

          <ul className="list-group mb-4">
            <li className="list-group-item">
              <strong>Marca:</strong> {produto.brand || "Sem marca"}
            </li>

            <li className="list-group-item">
              <strong>Estado:</strong> {produto.condition}
            </li>

            <li className="list-group-item">
              <strong>Vendedor:</strong>{" "}
              {produto.seller
                ? produto.seller.storeName || produto.seller.name
                : "Sem vendedor associado"}
            </li>
          </ul>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={handleAdicionarCarrinho}
            disabled={variantes.length > 0 && !temStock}
          >
            {temStock || variantes.length === 0
              ? "Adicionar ao carrinho"
              : "Produto esgotado"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;
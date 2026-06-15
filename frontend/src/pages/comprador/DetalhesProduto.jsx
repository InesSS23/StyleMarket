import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import { adicionarAoCarrinho } from "../../utils/carrinhoUtils";
import { obterUtilizador } from "../../utils/authUtils";
import { obterImagensProduto } from "../../utils/produtoUtils";

function DetalhesProduto() {
  const { id } = useParams();

  const utilizador = obterUtilizador();
  const podeComprar = !utilizador || utilizador.role === "comprador";

  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("");
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");
  const [indiceImagem, setIndiceImagem] = useState(0);

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
  const imagensProduto = obterImagensProduto(produto);
  const imagemAtual = imagensProduto[indiceImagem] || imagensProduto[0];

  const stockTotal =
    variantes.length > 0
      ? variantes.reduce(
          (total, variante) => total + Number(variante.stock || 0),
          0
        )
      : Number(produto.stock || 0);

  const produtoEsgotado = stockTotal <= 0;

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

  const temStockNaVariante =
    varianteSelecionada && Number(varianteSelecionada.stock) > 0;

  const podeAdicionar =
    variantes.length > 0
      ? Boolean(temStockNaVariante)
      : Number(produto.stock || 0) > 0;

  function imagemAnterior() {
    setIndiceImagem((indiceAtual) =>
      indiceAtual === 0 ? imagensProduto.length - 1 : indiceAtual - 1
    );
  }

  function imagemSeguinte() {
    setIndiceImagem((indiceAtual) =>
      indiceAtual === imagensProduto.length - 1 ? 0 : indiceAtual + 1
    );
  }

  function handleAdicionarCarrinho() {
    if (variantes.length > 0 && !varianteSelecionada) {
      alert("Seleciona uma cor e um tamanho.");
      return;
    }

    const resultado = adicionarAoCarrinho(produto, varianteSelecionada);
    alert(resultado.message);
  }

  return (
    <div className="container py-5">
      <Link to="/catalogo" className="btn btn-outline-dark mb-4">
        Voltar ao catálogo
      </Link>

      <div className="row g-5">
        <div className="col-md-6">
          <div className="position-relative">
            <img
              src={imagemAtual}
              alt={`${produto.name} - imagem ${indiceImagem + 1}`}
              className={`img-fluid rounded shadow-sm detalhe-produto-imagem ${
                produtoEsgotado ? "produto-imagem-esgotado" : ""
              }`}
            />

            {imagensProduto.length > 1 && (
              <>
                <button
                  type="button"
                  className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-3"
                  onClick={imagemAnterior}
                  aria-label="Imagem anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={imagemSeguinte}
                  aria-label="Imagem seguinte"
                >
                  ›
                </button>
              </>
            )}

            {produtoEsgotado && (
              <span className="badge bg-danger position-absolute top-0 end-0 m-3 fs-6">
                Esgotado
              </span>
            )}
          </div>

          {imagensProduto.length > 1 && (
            <div className="d-flex gap-2 overflow-auto mt-3 pb-2">
              {imagensProduto.map((imagem, index) => (
                <button
                  type="button"
                  className={`btn p-0 border-2 flex-shrink-0 ${
                    indiceImagem === index ? "border-primary" : "border-light"
                  }`}
                  onClick={() => setIndiceImagem(index)}
                  key={`${imagem.slice(0, 40)}-${index}`}
                  aria-label={`Ver imagem ${index + 1}`}
                >
                  <img
                    src={imagem}
                    alt={`${produto.name} miniatura ${index + 1}`}
                    style={{ width: 82, height: 82, objectFit: "cover" }}
                    className="rounded"
                  />
                </button>
              ))}
            </div>
          )}
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

          {produtoEsgotado && (
            <div className="alert alert-danger">
              Este produto está esgotado e já não pode ser adicionado ao
              carrinho.
            </div>
          )}

          {variantes.length > 0 && !produtoEsgotado && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Escolhe a cor</h5>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {coresDisponiveis.map((cor) => {
                  const corTemStock = variantes.some(
                    (variant) =>
                      variant.color === cor && Number(variant.stock) > 0
                  );

                  return (
                    <button
                      type="button"
                      className={
                        corSelecionada === cor
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      key={cor}
                      disabled={!corTemStock}
                      onClick={() => {
                        setCorSelecionada(cor);

                        const primeiraDaCor = variantes.find(
                          (variant) =>
                            variant.color === cor && Number(variant.stock) > 0
                        );

                        if (primeiraDaCor) {
                          setTamanhoSelecionado(primeiraDaCor.size);
                        } else {
                          setTamanhoSelecionado("");
                        }
                      }}
                    >
                      {cor}
                      {!corTemStock && " - Esgotada"}
                    </button>
                  );
                })}
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
                    disabled={Number(variant.stock) <= 0}
                    onClick={() => setTamanhoSelecionado(variant.size)}
                  >
                    {variant.size}
                    {Number(variant.stock) <= 0 && " - Esgotado"}
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

          {podeComprar ? (
            <button
              className="btn btn-primary btn-lg w-100"
              onClick={handleAdicionarCarrinho}
              disabled={!podeAdicionar}
            >
              {podeAdicionar ? "Adicionar ao carrinho" : "Produto esgotado"}
            </button>
          ) : (
            <div className="alert alert-secondary mb-0">
              Este perfil pode consultar produtos, mas não pode adicionar ao
              carrinho.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;

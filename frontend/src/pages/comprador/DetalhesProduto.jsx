import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function DetalhesProduto() {
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api
      .get(`/produtos/obter/${id}`)
      .then((response) => {
        if (response.data.success) {
          setProduto(response.data.data);
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

          <ul className="list-group mb-4">
            <li className="list-group-item">
              <strong>Tamanho:</strong> {produto.size}
            </li>

            <li className="list-group-item">
              <strong>Cor:</strong> {produto.color}
            </li>

            <li className="list-group-item">
              <strong>Marca:</strong> {produto.brand || "Sem marca"}
            </li>

            <li className="list-group-item">
              <strong>Estado:</strong> {produto.condition}
            </li>

            <li className="list-group-item">
              <strong>Stock:</strong> {produto.stock}
            </li>

            <li className="list-group-item">
              <strong>Vendedor:</strong>{" "}
              {produto.seller
                ? produto.seller.storeName || produto.seller.name
                : "Sem vendedor associado"}
            </li>
          </ul>

          <button className="btn btn-primary btn-lg w-100">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;
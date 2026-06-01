import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

function DashboardVendedor() {
  const [produtos, setProdutos] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const sellerId = getSellerId();

  useEffect(() => {
    carregarProdutos();
    api
      .get(`/encomendas/listar/vendedor/${sellerId}`)
      .then((encomendasResponse) => {
        if (encomendasResponse.data.success) {
          setEncomendas(encomendasResponse.data.data);
        }
      })
      .catch(() => {
        setErro("Erro ao carregar os dados do vendedor.");
      });
  }, [sellerId]);

  function carregarProdutos() {
    setCarregando(true);
    api
      .get(`/produtos/listar/vendedor/${sellerId}`)
      .then((response) => {
        if (response.data.success) {
          setProdutos(response.data.data);
        }
      })
      .catch(() => setErro("Erro ao carregar os produtos."))
      .finally(() => setCarregando(false));
  }

  function apagarProduto(id) {
    if (!window.confirm("Tem a certeza que quer apagar este produto?")) return;

    api
      .delete(`/produtos/apagar/${id}`)
      .then((response) => {
        if (response.data.success) {
          carregarProdutos();
        } else {
          alert("Não foi possível apagar o produto.");
        }
      })
      .catch(() => alert("Erro ao ligar ao servidor."));
  }

  const totalRecebido = encomendas.reduce((acc, order) => acc + Number(order.total || 0), 0);
  const totalVendas = encomendas.reduce((acc, order) => acc + order.orderItems.length, 0);
  const pedidosPendentes = encomendas.filter((order) => order.status === "Pendente").length;
  const produtosAtivos = produtos.length;

  const topProduto = encomendas
    .flatMap((order) => order.orderItems)
    .reduce((acc, item) => {
      const key = item.product?.id || item.productId;
      const nome = item.product?.name || "Produto";
      if (!acc[key]) acc[key] = { nome, quantidade: 0 };
      acc[key].quantidade += Number(item.quantity || 0);
      return acc;
    }, {});

  const produtoMaisVendido = Object.values(topProduto).sort((a, b) => b.quantidade - a.quantidade)[0];

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1>Dashboard do Vendedor</h1>
          <p className="text-muted">Bem-vindo de volta, João Silva! Aqui está um resumo da tua atividade.</p>
        </div>

        <Link className="btn btn-primary align-self-start" to="/vendedor/adicionar-produto">
          + Adicionar Produto
        </Link>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4">
            <p className="mb-1 text-muted">Produtos Ativos</p>
            <h3>{produtosAtivos} </h3>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4">
            <p className="mb-1 text-muted">Produtos Vendidos</p>
            <h3>{totalVendas} </h3>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4">
            <p className="mb-1 text-muted">Total Recebido</p>
            <h3>{totalRecebido.toFixed(2)} €</h3>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4">
            <p className="mb-1 text-muted">Encomendas Pendentes</p>
            <h3>{pedidosPendentes} </h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-12">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Os Meus Produtos</h5>
              <Link to="/vendedor/produtos" className="text-decoration-none">
                Ver todos →
              </Link>
            </div>
            <div className="table-responsive mt-3">
              <table className="table table-sm table-hover align-middle">
                <thead>
                  <tr>
                    <th>imagem</th>
                    <th>Nome</th>
                    <th>categoria</th>
                    <th>tamanho</th>
                    <th>Preço</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.slice(0, 5).map((produto) => (
                    <tr key={produto.id}>
                      <td>
                        <img
                          src={produto.imageUrl || "/placeholder.png"}
                          alt={produto.name}
                          className="img-thumbnail"
                          style={{ maxWidth: "100px", height: "auto" }}
                        />
                      </td>
                      <td>{produto.name}</td>
                      <td>{produto.category?.name || "Sem categoria"}</td>
                      <td>{produto.size}</td>
                      <td>{Number(produto.price).toFixed(2)} €</td>
                      <td>{produto.stock}</td>
                      <td>{produto.condition}</td>
                      <td>
                        <Link
                          className="btn btn-sm btn-outline-primary me-2"
                          to={`/vendedor/editar-produto/${produto.id}`}
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => apagarProduto(produto.id)}
                        >
                          Apagar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {produtos.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-muted">
                        Sem produtos publicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardVendedor;

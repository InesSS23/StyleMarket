import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";
// Importação dos ícones do Lucide React
import { 
  Package, 
  ShoppingBag, 
  Euro, 
  Clock, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowRight 
} from "lucide-react";

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

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Dashboard do Vendedor</h1>
          <p className="text-muted mb-0">Bem-vindo de volta! Aqui está um resumo da tua atividade.</p>
        </div>

        <Link className="btn btn-primary d-inline-flex align-items-center gap-2" to="/vendedor/adicionar-produto">
          <Plus size={18} /> Adicionar Produto
        </Link>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {/* Cartões de Métricas com Ícones */}
      <div className="row g-3 mb-4">
        {/* Produtos Ativos */}
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted fw-medium">Produtos Ativos</p>
                <h3 className="mb-0 fw-bold">{produtosAtivos}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Package size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Vendidos */}
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted fw-medium">Produtos Vendidos</p>
                <h3 className="mb-0 fw-bold">{totalVendas}</h3>
              </div>
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle d-flex align-items-center justify-content-center">
                <ShoppingBag size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Total Recebido */}
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted fw-medium">Total Recebido</p>
                <h3 className="mb-0 fw-bold">{totalRecebido.toFixed(2)} €</h3>
              </div>
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Euro size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Encomendas Pendentes */}
        <div className="col-sm-6 col-xl-3">
          <div className="card shadow-sm p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted fw-medium">Encomendas Pendentes</p>
                <h3 className="mb-0 fw-bold">{pedidosPendentes}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle d-flex align-items-center justify-content-center">
                <Clock size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="row g-4">
        <div className="col-lg-12">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">Os Meus Produtos</h5>
              <Link to="/vendedor/produtos" className="text-decoration-none d-flex align-items-center gap-1 small fw-medium">
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Tamanho</th>
                    <th>Preço</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.slice(0, 5).map((produto) => (
                    <tr key={produto.id}>
                      <td>
                        <img
                          src={produto.imageUrl || "/placeholder.png"}
                          alt={produto.name}
                          className="rounded border"
                          style={{ width: "48px", height: "48px", objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-medium">{produto.name}</td>
                      <td>{produto.category?.name || "Sem categoria"}</td>
                      <td><span className="badge bg-light text-dark border">{produto.size}</span></td>
                      <td className="fw-semibold">{Number(produto.price).toFixed(2)} €</td>
                      <td>{produto.stock} u.</td>
                      <td>
                        <span className={`badge ${produto.condition === "Novo" ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                          {produto.condition}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Link
                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                            to={`/vendedor/editar-produto/${produto.id}`}
                          >
                            <Pencil size={14} /> Editar
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                            onClick={() => apagarProduto(produto.id)}
                          >
                            <Trash2 size={14} /> Apagar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {produtos.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">
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
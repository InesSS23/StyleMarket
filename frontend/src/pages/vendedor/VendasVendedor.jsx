import { useEffect, useState } from "react";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";
// Importação dos ícones do Lucide React
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Star 
} from "lucide-react";

function VendasVendedor() {
  const [encomendas, setEncomendas] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const sellerId = getSellerId();

  useEffect(() => {
    setCarregando(true);
    api
      .get(`/encomendas/listar/vendedor/${sellerId}`)
      .then((response) => {
        if (response.data.success) {
          setEncomendas(response.data.data);
          setErro("");
        } else {
          setErro("Não foi possível carregar as vendas.");
        }
      })
      .catch(() => {
        setErro("Erro ao ligar ao servidor.");
      })
      .finally(() => setCarregando(false));
  }, [sellerId]);

  const totalReceita = encomendas.reduce((total, order) => total + Number(order.total || 0), 0);
  
  // Contagem real das unidades físicas de produtos vendidas
  const produtosVendidos = encomendas.reduce(
    (total, order) =>
      total + order.orderItems.reduce((itemTotal, item) => itemTotal + Number(item.quantity || 0), 0),
    0
  );

  const receitaMes = encomendas.reduce((total, order) => {
    const created = order.createdAt ? new Date(order.createdAt) : null;
    const now = new Date();
    if (created && created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()) {
      return total + Number(order.total || 0);
    }
    return total;
  }, 0);

  // Lógica para descobrir o Produto Mais Vendido
  const contagemProdutos = encomendas
    .flatMap((order) => order.orderItems)
    .reduce((acc, item) => {
      const key = item.product?.id || item.productId;
      const nome = item.product?.name || "Produto Desconhecido";
      if (!acc[key]) acc[key] = { nome, quantidade: 0 };
      acc[key].quantidade += Number(item.quantity || 0);
      return acc;
    }, {});

  const produtoMaisVendido = Object.values(contagemProdutos).sort(
    (a, b) => b.quantidade - a.quantidade
  )[0];

  // Função para aplicar classes de cor dinâmicas às Badges dos Estados da encomenda
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Concluída":
        return "bg-success-subtle text-success";
      case "Enviada":
        return "bg-primary-subtle text-primary";
      case "Paga":
        return "bg-indigo-subtle text-indigo"; // Necessita do Bootstrap 5.3+ ou cor alternativa
      case "Pendente":
        return "bg-warning-subtle text-warning-emphasis";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  return (
    <div className="container py-5">
      {/* CABEÇALHO */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1">As Minhas Vendas</h1>
        <p className="text-muted mb-0">Consulta o histórico e o desempenho das tuas vendas.</p>
      </div>

      {erro && <div className="alert alert-danger rounded-3">{erro}</div>}

      {/* CARTÕES DE MÉTRICAS */}
      <div className="row g-3 mb-4">
        {/* Receita do Mês */}
        <div className="col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small fw-medium">Receita do Mês</p>
                <h2 className="mb-0 fw-bold">{receitaMes.toFixed(2)}€</h2>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Receita Total */}
        <div className="col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small fw-medium">Receita Total</p>
                <h2 className="mb-0 fw-bold">{totalReceita.toFixed(2)}€</h2>
              </div>
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-3">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Total de Vendas (Unidades) */}
        <div className="col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-1 text-muted small fw-medium">Total de Vendas</p>
                <h2 className="mb-0 fw-bold">{produtosVendidos}</h2>
              </div>
              <div className="bg-purple bg-opacity-10 text-purple p-3 rounded-3" style={{ backgroundColor: "rgba(111, 66, 193, 0.1)", color: "#6f42c1" }}>
                <ShoppingBag size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESTAQUE: PRODUTO MAIS VENDIDO */}
      {produtoMaisVendido && (
        <div className="card border-0 shadow-sm p-3 mb-4 rounded-4" style={{ backgroundColor: "#eef4ff", border: "1px solid #d0e1ff" }}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-circle d-flex align-items-center justify-content-center">
              <Star size={18} fill="currentColor" />
            </div>
            <div>
              <small className="text-primary text-uppercase fw-bold tracking-wider fs-7 d-block">Produto Mais Vendido</small>
              <strong className="text-dark d-block fs-6">{produtoMaisVendido.nome}</strong>
              <small className="text-muted">{produtoMaisVendido.quantidade} unidades vendidas</small>
            </div>
          </div>
        </div>
      )}

      {/* HISTÓRICO DE VENDAS */}
      {carregando ? (
        <div className="alert alert-secondary text-center py-4 rounded-3">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          A carregar vendas...
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h4 className="fw-bold text-dark mb-4">Histórico de Vendas</h4>
          
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase fs-7 text-muted border-bottom">
                <tr>
                  <th className="py-3 ps-3">Nº Encomenda</th>
                  <th className="py-3">Produto</th>
                  <th className="py-3">Comprador</th>
                  <th className="py-3 text-center">Quantidade</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 pe-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {encomendas.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Não existem vendas a mostrar.
                    </td>
                  </tr>
                )}
                {encomendas.map((order) =>
                  order.orderItems.map((item, index) => (
                    <tr key={`${order.id}-${item.id || index}`}>
                      {/* Nº Encomenda com Subtítulo opcional de ID */}
                      <td className="ps-3">
                        <span className="fw-semibold text-dark d-block">
                          VND-{String(order.id).padStart(3, "0")}
                        </span>
                        <small className="text-muted">#{1000 + Number(order.id)}</small>
                      </td>
                      
                      {/* Nome do Produto */}
                      <td className="fw-medium text-dark">
                        {item.product ? item.product.name : "Produto desconhecido"}
                      </td>
                      
                      {/* Comprador */}
                      <td className="text-secondary">
                        {order.buyer ? order.buyer.name : (order.user ? order.user.name : "Cliente anónimo")}
                      </td>
                      
                      {/* Quantidade formatada dentro de uma badge oval cinzenta */}
                      <td className="text-center">
                        <span className="badge bg-light text-dark rounded-pill px-3 py-2 border fs-7 fw-medium">
                          {item.quantity}
                        </span>
                      </td>
                      
                      {/* Preço Total do Artigo */}
                      <td className="fw-bold text-dark">
                        {Number((item.price || 0) * item.quantity).toFixed(2)}€
                      </td>
                      
                      {/* Estado Dinâmico */}
                      <td>
                        <span className={`badge px-2.5 py-1.5 fs-7 rounded-3 ${getStatusBadgeClass(order.status)}`}>
                          {order.status || "Pendente"}
                        </span>
                      </td>

                      {/* Data Formatada */}
                      <td className="pe-3 text-muted small">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("pt-PT") : (order.date || "—")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendasVendedor;


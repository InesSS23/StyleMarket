import { useEffect, useState } from "react";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

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
  const totalVendas = encomendas.reduce((total, order) => total + order.orderItems.length, 0);
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

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1>As Minhas Vendas</h1>
        <p className="text-muted">Consulta o histórico e o desempenho das tuas vendas.</p>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-4">
          <div className="card shadow-sm p-4">
            <p className="mb-1 text-muted">Receita do mês</p>
            <h3>{receitaMes.toFixed(2)} €</h3>
          </div>
        </div>
        <div className="col-sm-6 col-xl-4">
          <div className="card shadow-sm p-4">
            <p className="mb-1 text-muted"> Receita Total </p>
            <h3>{totalReceita.toFixed(2)} €</h3>
          </div>
        </div>
        <div className="col-sm-6 col-xl-4">
          <div className="card shadow-sm p-4">
            <p className="mb-1 text-muted">Total produtos vendidos</p>
            <h3>{produtosVendidos.toFixed(2)} €</h3>
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="alert alert-secondary">A carregar vendas...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nº Encomenda</th>
                <th>Produto</th>
                <th>Comprador</th>
                <th>Quantidade</th>
                <th>Total</th>
                <th>Estado</th>
              
              </tr>
            </thead>
            <tbody>
              {encomendas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Não existem vendas a mostrar.
                  </td>
                </tr>
              )}
              {encomendas.map((order) =>
                order.orderItems.map((item) => (
                  <tr key={`${order.id}-${item.id}`}>
                    <td>VND-{String(order.id).padStart(3, "0")}</td>
                    <td>{item.product ? item.product.name : "Produto desconhecido"}</td>
                    <td>{order.buyer ? order.buyer.name : "Cliente anónimo"}</td>
                    <td>{item.quantity}</td>
                    <td>{Number(item.price * item.quantity).toFixed(2)} €</td>
                    <td>{order.status}</td>
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VendasVendedor;

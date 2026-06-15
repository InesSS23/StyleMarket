import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { guardarCarrinho, obterCarrinho } from "../../utils/carrinhoUtils";

function FinalizarCompra() {
  const [itens, setItens] = useState(() => obterCarrinho());
  const [encomenda, setEncomenda] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [dadosPagamento, setDadosPagamento] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    mbwayPhone: "",
    paypalEmail: "",
  });

  const [dados, setDados] = useState({
    nome: "",
    email: "",
    contacto: "",
    morada: "",
    codigoPostal: "",
    cidade: "",
    pagamento: "Cartão de crédito/débito",
  });

  const subtotal = itens.reduce(
    (soma, item) => soma + Number(item.price) * item.quantidade,
    0
  );

  const envio = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + envio;

  function handleChange(event) {
    const { name, value } = event.target;

    setDados({
      ...dados,
      [name]: value,
    });
  }

  function handlePaymentChange(event) {
    const { name, value } = event.target;

    setDadosPagamento({
      ...dadosPagamento,
      [name]: value,
    });
  }

  function validarDadosPagamento() {
    if (dados.pagamento === "Cartão de crédito/débito") {
      if (
        !dadosPagamento.cardNumber ||
        !dadosPagamento.cardName ||
        !dadosPagamento.cardExpiry ||
        !dadosPagamento.cardCvv
      ) {
        setErro("Preenche os dados do cartão de crédito/débito.");
        return false;
      }

      return true;
    }

    if (dados.pagamento === "MB WAY") {
      if (!dadosPagamento.mbwayPhone) {
        setErro("Preenche o número de telemóvel do MB WAY.");
        return false;
      }

      return true;
    }

    if (dados.pagamento === "PayPal") {
      if (!dadosPagamento.paypalEmail) {
        setErro("Preenche o email da conta PayPal.");
        return false;
      }

      return true;
    }

    setErro("Escolhe um método de pagamento.");
    return false;
  }

  function confirmarEncomenda(event) {
    event.preventDefault();
    setErro("");

    if (
      !dados.nome ||
      !dados.email ||
      !dados.contacto ||
      !dados.morada ||
      !dados.codigoPostal ||
      !dados.cidade
    ) {
      setErro("Preenche todos os campos obrigatórios.");
      return;
    }

    if (!validarDadosPagamento()) {
      return;
    }

    const items = itens.map((item) => ({
      productId: item.id,
      productVariantId: item.variantId,
      quantity: item.quantidade,
    }));

    setLoading(true);

    api
      .post("/encomendas/criar", {
        customer: {
          name: dados.nome,
          email: dados.email,
          phone: dados.contacto,
          address: dados.morada,
          postalCode: dados.codigoPostal,
          city: dados.cidade,
        },
        paymentMethod: dados.pagamento,
        items,
      })
      .then((response) => {
        if (response.data.success) {
          guardarCarrinho([]);
          setItens([]);
          setEncomenda(response.data.data);
        } else {
          setErro("Não foi possível confirmar a encomenda.");
        }
      })
      .catch((error) => {
        setErro(
          error.response?.data?.message ||
            "Erro ao ligar ao servidor."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (encomenda) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center">
        <div className="container py-5">
          <div className="checkout-success mx-auto">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body p-5">
                <div className="success-circle mx-auto mb-4">✓</div>

                <h1 className="fw-bold mb-2">Encomenda confirmada</h1>

                <p className="text-muted mb-3">
                  A tua encomenda foi registada com sucesso na base de dados.
                </p>

                <p className="mb-4">
                  Número da encomenda: <strong>#{encomenda.id}</strong>
                </p>

                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <Link to="/catalogo" className="btn btn-primary">
                    Voltar ao catálogo
                  </Link>

                  <Link to="/" className="btn btn-outline-dark">
                    Ir para início
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center">
        <div className="container py-5 text-center">
          <h1 className="fw-bold mb-2">Finalizar Compra</h1>

          <p className="text-muted mb-4">
            Não existem produtos no carrinho para finalizar a compra.
          </p>

          <Link to="/catalogo" className="btn btn-primary px-5">
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container checkout-container">
        <div className="mb-4">
          <h1 className="fw-bold mb-1">Finalizar Compra</h1>
          <p className="text-muted mb-0">
            Preenche os teus dados para confirmar a encomenda.
          </p>
        </div>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <form onSubmit={confirmarEncomenda}>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-4 checkout-card">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Dados de Envio</h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={dados.nome}
                        onChange={handleChange}
                        placeholder="Nome do comprador"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={dados.email}
                        onChange={handleChange}
                        placeholder="email@exemplo.com"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Contacto</label>
                      <input
                        type="text"
                        className="form-control"
                        name="contacto"
                        value={dados.contacto}
                        onChange={handleChange}
                        placeholder="+351 912 345 678"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        Código postal
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="codigoPostal"
                        value={dados.codigoPostal}
                        onChange={handleChange}
                        placeholder="3500-000"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium">Morada</label>
                      <input
                        type="text"
                        className="form-control"
                        name="morada"
                        value={dados.morada}
                        onChange={handleChange}
                        placeholder="Rua, número, andar"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Cidade</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cidade"
                        value={dados.cidade}
                        onChange={handleChange}
                        placeholder="Viseu"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm checkout-card">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Método de Pagamento</h5>

                  <div className="payment-option mb-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="cartao"
                      name="pagamento"
                      value="Cartão de crédito/débito"
                      checked={dados.pagamento === "Cartão de crédito/débito"}
                      onChange={handleChange}
                    />

                    <label htmlFor="cartao" className="form-check-label">
                      Cartão de crédito/débito
                    </label>
                  </div>

                  {dados.pagamento === "Cartão de crédito/débito" && (
                    <div className="payment-details-panel mb-3">
                      <h6 className="fw-bold mb-3">Dados do cartão</h6>

                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-medium">
                            Nome no cartão
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="cardName"
                            value={dadosPagamento.cardName}
                            onChange={handlePaymentChange}
                            placeholder="Nome como aparece no cartão"
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-medium">
                            Número do cartão
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="cardNumber"
                            value={dadosPagamento.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Validade
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="cardExpiry"
                            value={dadosPagamento.cardExpiry}
                            onChange={handlePaymentChange}
                            placeholder="MM/AA"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-medium">CVV</label>
                          <input
                            type="text"
                            className="form-control"
                            name="cardCvv"
                            value={dadosPagamento.cardCvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="payment-option mb-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="mbway"
                      name="pagamento"
                      value="MB WAY"
                      checked={dados.pagamento === "MB WAY"}
                      onChange={handleChange}
                    />

                    <label htmlFor="mbway" className="form-check-label">
                      MB WAY
                    </label>
                  </div>

                  {dados.pagamento === "MB WAY" && (
                    <div className="payment-details-panel mb-3">
                      <h6 className="fw-bold mb-3">Dados do MB WAY</h6>

                      <div>
                        <label className="form-label fw-medium">
                          Número de telemóvel
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          name="mbwayPhone"
                          value={dadosPagamento.mbwayPhone}
                          onChange={handlePaymentChange}
                          placeholder="+351 912 345 678"
                        />
                      </div>
                    </div>
                  )}

                  <div className="payment-option">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="paypal"
                      name="pagamento"
                      value="PayPal"
                      checked={dados.pagamento === "PayPal"}
                      onChange={handleChange}
                    />

                    <label htmlFor="paypal" className="form-check-label">
                      PayPal
                    </label>
                  </div>

                  {dados.pagamento === "PayPal" && (
                    <div className="payment-details-panel mt-3">
                      <h6 className="fw-bold mb-3">Dados do PayPal</h6>

                      <div>
                        <label className="form-label fw-medium">
                          Email da conta PayPal
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="paypalEmail"
                          value={dadosPagamento.paypalEmail}
                          onChange={handlePaymentChange}
                          placeholder="conta@paypal.com"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm order-summary-card">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Resumo</h5>

                  <div className="checkout-items mb-3">
                    {itens.map((item) => (
                      <div className="d-flex gap-3 mb-3" key={item.id}>
                        <img
                          src={item.image || "/images/produtos/sem-imagem.jpg"}
                          alt={item.name}
                          className="checkout-product-image"
                        />

                        <div className="flex-grow-1">
                          <strong>{item.name}</strong>
                          <br />
                          <small className="text-muted">
                            {item.size} · {item.color} · qtd. {item.quantidade}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between text-muted mb-2">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>

                  <div className="d-flex justify-content-between text-muted mb-2">
                    <span>Envio</span>
                    <span>{envio === 0 ? "Grátis" : `${envio.toFixed(2)} €`}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "A confirmar..." : "Confirmar compra"}
                  </button>

                  <Link
                    to="/carrinho"
                    className="btn btn-outline-secondary w-100 mt-2"
                  >
                    Voltar ao carrinho
                  </Link>

                  <p className="text-muted text-center mt-3 mb-0 small">
                    Ao confirmar, a encomenda será guardada na base de dados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FinalizarCompra;
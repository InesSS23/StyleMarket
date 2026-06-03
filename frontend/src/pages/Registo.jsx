import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Register() {
  const navigate = useNavigate(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [role, setRole] = useState("comprador"); // 'comprador' ou 'vendedor'
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro(""); 

    // Validação estrita: Bloqueia o envio se as passwords não coincidirem
    if (password !== confirmarPassword) {
      setErro("As passwords não coincidem!");
      return;
    }

    // Dados estruturados prontos para enviar para o teu backend
    const dadosRegisto = { name, email, password, role };
    console.log("Dados do Registo:", dadosRegisto);
    
    
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-4 bg-light">
      {/* Header do Logótipo */}
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1 text-primary fw-bold fs-3">
          <i className="bi bi-cart-fill bg-primary text-white p-2 rounded-3 fs-4 d-inline-flex"></i>
          <span>StyleMarket</span>
        </div>
        <small className="text-muted">Cria a tua conta</small>
      </div>

      {/* Cartão do Formulário */}
      <div
        className="card shadow-sm p-4 w-100"
        style={{ maxWidth: "440px", borderRadius: "1.25rem" }}
      >
        <h2 className="fw-bold mb-1 fs-3">Criar Conta</h2>
        <p className="text-muted small mb-4">
          Regista-te para começares a comprar ou a vender os teus produtos.
        </p>

        {erro && <div className="alert alert-danger p-2 small text-center">{erro}</div>}

        <form onSubmit={handleSubmit}>
          {/* Nome Completo */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Nome Completo
            </label>
            <div className="position-relative">
              <i className="bi bi-person position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary"></i>
              <input
                type="text"
                className="form-control ps-5"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ height: "3.2rem", borderRadius: "0.5rem" }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Email
            </label>
            <div className="position-relative">
              <i className="bi bi-envelope position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary"></i>
              <input
                type="email"
                className="form-control ps-5"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: "3.2rem", borderRadius: "0.5rem" }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Password
            </label>
            <div className="position-relative">
              <i className="bi bi-lock position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary"></i>
              <input
                type="password"
                className="form-control ps-5"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ height: "3.2rem", borderRadius: "0.5rem" }}
                required
              />
            </div>
          </div>

          {/* Confirmar Password */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Confirmar Password
            </label>
            <div className="position-relative">
              <i className="bi bi-lock position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary"></i>
              <input
                type="password"
                className={`form-control ps-5 ${confirmarPassword && password !== confirmarPassword ? "is-invalid" : ""}`}
                placeholder="••••••••"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                style={{ height: "3.2rem", borderRadius: "0.5rem" }}
                required
              />
              {confirmarPassword && password !== confirmarPassword && (
                <div className="invalid-feedback">
                  As passwords não coincidem.
                </div>
              )}
            </div>
          </div>

          {/* Seleção do Tipo de Conta */}
          <div className="mb-4">
            <label className="form-label text-secondary small fw-semibold d-block">
              Tipo de Conta
            </label>
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  className={`btn w-100 py-3 d-flex flex-column align-items-center justify-content-center border-2 ${
                    role === "comprador" ? "btn-outline-primary active" : "btn-outline-light text-dark"
                  }`}
                  style={{ borderRadius: "0.5rem", height: "4.5rem" }}
                  onClick={() => setRole("comprador")}
                >
                  <i className="bi bi-cart3 fs-5 mb-1"></i>
                  <span className="small fw-semibold">Comprador</span>
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className={`btn w-100 py-3 d-flex flex-column align-items-center justify-content-center border-2 ${
                    role === "vendedor" ? "btn-outline-primary active" : "btn-outline-light text-dark"
                  }`}
                  style={{ borderRadius: "0.5rem", height: "4.5rem" }}
                  onClick={() => setRole("vendedor")}
                >
                  <i className="bi bi-person-badge fs-5 mb-1"></i>
                  <span className="small fw-semibold">Vendedor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Botão de Submissão */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            style={{ height: "3.2rem", borderRadius: "0.5rem" }}
          >
            Criar Conta
          </button>

          {/* Link de Retorno para o Login */}
          <div className="text-center small text-muted mt-4">
            Já tens uma conta?{" "}
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none fw-semibold border-0 align-baseline"
              onClick={() => navigate("/login")}
            >
              Iniciar sessão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;  
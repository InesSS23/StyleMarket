import React, { useState } from "react";

function Registo() {
  // Estados para controlar os inputs do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("comprador"); // "comprador" por padrão

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Dados do Registo:", { nome, email, password, accountType });
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-4 bg-light">
      
      {/* Header Logo */}
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1 text-primary fw-bold fs-3">
          <i className="bi bi-cart-fill bg-primary text-white p-2 rounded-3 fs-4 d-inline-flex"></i>
          <span>StyleMarket</span>
        </div>
        <small class="text-muted">Cria a tua conta</small>
      </div>

      {/* Card Principal */}
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "440px", borderRadius: "1.25rem" }}>
        <h2 className="fw-bold mb-4 fs-3">Criar Conta</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Nome Completo */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">Nome Completo</label>
            <div className="position-relative">
              <i className="bi bi-person position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary"></i>
              <input 
                type="text" 
                className="form-control ps-5" 
                placeholder="João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{ height: "3.2rem", borderRadius: "0.5rem" }}
                required 
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">Email</label>
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
            <label className="form-label text-secondary small fw-semibold">Password</label>
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

          {/* Tipo de Conta (Custom Cards em Bootstrap) */}
          <div className="mb-4">
            <label className="form-label text-secondary small fw-semibold">Tipo de Conta</label>
            <div className="row g-2">
              
              
              <div className="col-6">
                <button
                  type="button"
                  className={`w-100 p-3 btn text-center border d-flex flex-column align-items-center justify-content-center ${
                    accountType === "comprador" 
                      ? "border-primary text-primary fw-semibold" 
                      : "border-secondary-subtle text-secondary"
                  }`}
                  style={{ 
                    borderRadius: "0.5rem", 
                    backgroundColor: accountType === "comprador" ? "#f0f5ff" : "#fff",
                    borderWidth: accountType === "comprador" ? "2px" : "1px"
                  }}
                  onClick={() => setAccountType("comprador")}
                >
                  <i className="bi bi-cart fs-4 mb-1"></i>
                  Comprador
                </button>
              </div>

           
              <div className="col-6">
                <button
                  type="button"
                  className={`w-100 p-3 btn text-center border d-flex flex-column align-items-center justify-content-center ${
                    accountType === "vendedor" 
                      ? "border-primary text-primary fw-semibold" 
                      : "border-secondary-subtle text-secondary"
                  }`}
                  style={{ 
                    borderRadius: "0.5rem", 
                    backgroundColor: accountType === "vendedor" ? "#f0f5ff" : "#fff",
                    borderWidth: accountType === "vendedor" ? "2px" : "1px"
                  }}
                  onClick={() => setAccountType("vendedor")}
                >
                  <i className="bi bi-person-workspace fs-4 mb-1"></i>
                  Vendedor
                </button>
              </div>

            </div>
          </div>

          {/* Botão Criar Conta */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-semibold" 
            style={{ height: "3.2rem", borderRadius: "0.5rem" }}
          >
            Criar Conta
          </button>

          {/* Link de Alternância */}
          <div className="text-center small text-muted mt-4">
            Já tens uma conta? <a href="#login" className="text-decoration-none fw-semibold">Iniciar sessão</a>
          </div>
        </form>
      </div>

    </div>
  );
}

export default Registo;
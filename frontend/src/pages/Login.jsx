import React, { useState } from "react";

function Login() {
  // Estados para controlar os inputs do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui vais ligar ao teu backend futuramente:
    console.log("Dados do Login:", { email, password, rememberMe });
  };

  // Função utilitária para preencher rapidamente as contas de demonstração ao clicar
  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("1234"); // ou a password padrão que definires
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-4 bg-light">
      
      {/* Header Logo */}
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1 text-primary fw-bold fs-3">
          <i className="bi bi-cart-fill bg-primary text-white p-2 rounded-3 fs-4 d-inline-flex"></i>
          <span>StyleMarket</span>
        </div>
        <small className="text-muted">Bem-vindo de volta!</small>
      </div>

      {/* Card Principal */}
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "440px", borderRadius: "1.25rem" }}>
        <h2 className="fw-bold mb-1 fs-3">Iniciar Sessão</h2>
        <p className="text-muted small mb-4">Entrada única para comprador, vendedor e administrador.</p>
        
        <form onSubmit={handleSubmit}>
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

          {/* Lembrar-me & Esqueci a password */}
          <div className="d-flex justify-content-between align-items-center mb-4 small">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label text-secondary" htmlFor="rememberMe">Lembrar-me</label>
            </div>
            <a href="#esqueci" className="text-decoration-none fw-semibold">Esqueci a password</a>
          </div>

          {/* Botão Entrar */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-semibold py-2" 
            style={{ height: "3.2rem", borderRadius: "0.5rem" }}
          >
            Entrar
          </button>

          {/* Link de Alternância */}
          <div className="text-center small text-muted my-4">
            Ainda não tens conta? <a href="#criar-conta" className="text-decoration-none fw-semibold">Criar conta</a>
          </div>

          <hr className="text-muted opacity-25 mb-4" />

          {/* Contas de Demonstração */}
          <div className="text-center">
            <p className="text-secondary small mb-2" style={{ fontSize: "0.8rem" }}>
              Clique para preencher a demonstração:
            </p>
            
            
           
          </div>
        </form>
      </div>

    </div>
  );
}

export default Login;
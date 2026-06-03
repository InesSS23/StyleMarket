import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    const dadosLogin = { email, password, rememberMe };
    console.log("A iniciar sessão com:", dadosLogin);
    
   
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-4 bg-light">
      {/* Header do Logótipo */}
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1 text-primary fw-bold fs-3">
          <i className="bi bi-cart-fill bg-primary text-white p-2 rounded-3 fs-4 d-inline-flex"></i>
          <span>StyleMarket</span>
        </div>
        <small className="text-muted">Bem-vindo de volta!</small>
      </div>

      {/* Cartão do Formulário */}
      <div 
        className="card shadow-sm p-4 w-100" 
        style={{ maxWidth: "440px", borderRadius: "1.25rem" }}
      >
        <h2 className="fw-bold mb-1 fs-3">Login</h2>
        <p className="text-muted small mb-4">
          Entrada única para comprador, vendedor e administrador.
        </p>

        {erro && <div className="alert alert-danger p-2 small text-center">{erro}</div>}

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

        
          <div className="d-flex justify-content-between align-items-center mb-4 small">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label text-secondary" htmlFor="rememberMe">
                Lembrar-me
              </label>
            </div>
            <a href="#esqueci" className="text-decoration-none fw-semibold">
              Esqueci a password
            </a>
          </div>

         
          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-semibold" 
            style={{ height: "3.2rem", borderRadius: "0.5rem" }}
          >
            Entrar
          </button>

          {/* Link para o ecrã de Registo */}
          <div className="text-center small text-muted mt-4">
            Ainda não tens conta?{" "}
            <button 
              type="button" 
              className="btn btn-link p-0 text-decoration-none fw-semibold border-0 align-baseline"
              onClick={() => navigate("/registo")} 
            >
              Criar conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
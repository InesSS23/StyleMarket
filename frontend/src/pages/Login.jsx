import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function guardarUtilizador(user) {
    const dados = JSON.stringify(user);

    if (rememberMe) {
      localStorage.setItem("utilizador", dados);
    } else {
      sessionStorage.setItem("utilizador", dados);
    }
  }

  function redirecionarPorPerfil(role) {
    if (role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (role === "vendedor") {
      navigate("/vendedor/dashboard");
      return;
    }

    navigate("/");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    api
      .post("/auth/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.success) {
          const user = response.data.data;

          guardarUtilizador(user);
          redirecionarPorPerfil(user.role);
        } else {
          setErro("Não foi possível iniciar sessão.");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErro(error.response.data.message);
        } else {
          setErro("Erro ao ligar ao servidor.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-4 bg-light">
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1 text-primary fw-bold fs-3">
          <span>StyleMarket</span>
        </div>
        <small className="text-muted">Bem-vindo de volta!</small>
      </div>

      <div
        className="card shadow-sm p-4 w-100"
        style={{ maxWidth: "440px", borderRadius: "1.25rem" }}
      >
        <h2 className="fw-bold mb-1 fs-3">Login</h2>

        <p className="text-muted small mb-4">
          Entrada única para comprador, vendedor e administrador.
        </p>

        {erro && (
          <div className="alert alert-danger p-2 small text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ height: "3.2rem", borderRadius: "0.5rem" }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{ height: "3.2rem", borderRadius: "0.5rem" }}
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 small">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />

              <label
                className="form-check-label text-secondary"
                htmlFor="rememberMe"
              >
                Lembrar-me
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            style={{ height: "3.2rem", borderRadius: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>

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

          <div className="alert alert-secondary small mt-4 mb-0">
            <strong>Contas de teste:</strong>
            <br />
            admin@stylemarket.com / 1234
            <br />
            vendedor@stylemarket.com / 1234
            <br />
            comprador@stylemarket.com / 1234
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
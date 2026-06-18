import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { guardarUtilizador } from "../utils/authUtils";
import { tratarCarrinhoAposLogin } from "../utils/carrinhoUtils";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function caminhoPermitido(caminho, role) {
    if (caminho.startsWith("/admin") && role !== "admin") {
      return false;
    }

    if (
      caminho.startsWith("/vendedor") &&
      role !== "vendedor"
    ) {
      return false;
    }

    if (
      (caminho === "/carrinho" ||
        caminho === "/finalizar-compra") &&
      role !== "comprador"
    ) {
      return false;
    }

    return true;
  }

  function redirecionarPorPerfil(user) {
    const caminhoAnterior = location.state?.from?.pathname;

    if (
      caminhoAnterior &&
      caminhoPermitido(caminhoAnterior, user.role)
    ) {
      navigate(caminhoAnterior, { replace: true });
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (user.role === "vendedor") {
      navigate("/vendedor/dashboard", { replace: true });
      return;
    }

    navigate("/", { replace: true });
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

          guardarUtilizador(user, rememberMe);

          /*
            Comprador:
            junta o carrinho visitante ao carrinho da conta.

            Vendedor ou administrador:
            elimina o carrinho visitante.
          */
          tratarCarrinhoAposLogin(user);

          redirecionarPorPerfil(user);
        } else {
          setErro("Não foi possível iniciar sessão.");
        }
      })
      .catch((error) => {
        if (error.response?.data?.message) {
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
      <div className="d-flex flex-column align-items-center text-center mb-4">
        <Link
          to="/"
          className="text-primary fw-bold fs-3 text-decoration-none"
        >
          StyleMarket
        </Link>

        <small className="d-block text-muted mt-1">
          Bem-vindo de volta!
        </small>
      </div>

      <div
        className="card shadow-sm p-4 w-100"
        style={{
          maxWidth: "440px",
          borderRadius: "1.25rem",
        }}
      >
        <h2 className="fw-bold mb-1 fs-3">Login</h2>

        {location.state?.from?.pathname ===
          "/finalizar-compra" && (
          <div className="alert alert-info small">
            Para finalizares a compra, inicia sessão com uma
            conta de comprador. Os produtos serão associados ao
            carrinho dessa conta.
          </div>
        )}

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
              onChange={(event) =>
                setEmail(event.target.value)
              }
              style={{
                height: "3.2rem",
                borderRadius: "0.5rem",
              }}
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
              onChange={(event) =>
                setPassword(event.target.value)
              }
              style={{
                height: "3.2rem",
                borderRadius: "0.5rem",
              }}
              required
            />
          </div>

          <div className="form-check mb-4 small">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
            />

            <label
              className="form-check-label text-secondary"
              htmlFor="rememberMe"
            >
              Lembrar-me
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            style={{
              height: "3.2rem",
              borderRadius: "0.5rem",
            }}
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
        </form>
      </div>
    </div>
  );
}

export default Login;
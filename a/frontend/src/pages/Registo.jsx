import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Registo() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [pretendeVender, setPretendeVender] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeContact, setStoreContact] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (password !== confirmarPassword) {
      setErro("As passwords não coincidem.");
      return;
    }

    if (pretendeVender && !storeName.trim()) {
      setErro("Indica o nome público do vendedor ou da loja.");
      return;
    }

    const role = pretendeVender ? "vendedor" : "comprador";

    const dadosRegisto = {
      name,
      email,
      password,
      role,
      storeName: pretendeVender ? storeName : null,
      storeDescription: pretendeVender ? storeDescription : null,
      storeContact: pretendeVender ? storeContact : null,
    };

    setLoading(true);

    api
      .post("/auth/registar", dadosRegisto)
      .then((response) => {
        if (response.data.success) {
          setSucesso("Conta criada com sucesso. Já podes iniciar sessão.");

          setName("");
          setEmail("");
          setPassword("");
          setConfirmarPassword("");
          setPretendeVender(false);
          setStoreName("");
          setStoreDescription("");
          setStoreContact("");

          setTimeout(() => {
            navigate("/login");
          }, 1200);
        } else {
          setErro("Não foi possível criar a conta.");
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
        <small className="text-muted">Cria a tua conta</small>
      </div>

      <div
        className="card shadow-sm p-4 w-100"
        style={{ maxWidth: "520px", borderRadius: "1.25rem" }}
      >
        <h2 className="fw-bold mb-1 fs-3">Criar Conta</h2>

        <p className="text-muted small mb-4">
          O comprador é o perfil padrão. Ativa a opção de vendedor se quiseres
          vender roupas na plataforma.
        </p>

        {erro && (
          <div className="alert alert-danger p-2 small text-center">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="alert alert-success p-2 small text-center">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Nome completo
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="João Silva"
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={{ height: "3.2rem", borderRadius: "0.5rem" }}
              required
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">
              Confirmar password
            </label>

            <input
              type="password"
              className={`form-control ${confirmarPassword && password !== confirmarPassword
                  ? "is-invalid"
                  : ""
                }`}
              placeholder="••••••••"
              value={confirmarPassword}
              onChange={(event) => setConfirmarPassword(event.target.value)}
              style={{ height: "3.2rem", borderRadius: "0.5rem" }}
              required
            />

            {confirmarPassword && password !== confirmarPassword && (
              <div className="invalid-feedback">
                As passwords não coincidem.
              </div>
            )}
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="pretendeVender"
              checked={pretendeVender}
              onChange={(event) => setPretendeVender(event.target.checked)}
            />

            <label className="form-check-label" htmlFor="pretendeVender">
              Pretendo vender roupas nesta plataforma
            </label>
          </div>

          {pretendeVender && (
            <div className="card bg-light border-0 mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-2">
                  Informações do vendedor
                </h6>

                <p className="text-muted small mb-3">
                  Podes vender em nome próprio ou através de uma loja.
                  Este será o nome apresentado publicamente nos teus produtos.
                </p>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Nome do vendedor / Nome da loja
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex.: Maria Santos ou Maria Store"
                    value={storeName}
                    onChange={(event) => setStoreName(event.target.value)}
                    required={pretendeVender}
                  />

                  <div className="form-text">
                    Escreve o teu nome caso vendas como pessoa individual ou o
                    nome comercial caso representes uma loja.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Descrição do vendedor / loja
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Breve descrição sobre ti, os produtos que vendes ou a tua loja"
                    value={storeDescription}
                    onChange={(event) =>
                      setStoreDescription(event.target.value)
                    }
                  ></textarea>
                </div>

                <div>
                  <label className="form-label small fw-semibold">
                    Contacto do vendedor / loja
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contacto telefónico ou email"
                    value={storeContact}
                    onChange={(event) => setStoreContact(event.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="alert alert-secondary small">
            O acesso de administrador é criado internamente pela plataforma e
            não está disponível no registo público.
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            style={{ height: "3.2rem", borderRadius: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "A criar conta..." : "Criar conta"}
          </button>

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

export default Registo;
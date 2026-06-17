import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import {
  obterUtilizador,
  terminarSessao,
} from "../../utils/authUtils";
import { limparCarrinhoVisitante } from "../../utils/carrinhoUtils";

function PerfilComprador() {
  const navigate = useNavigate();

  const utilizadorSessao = obterUtilizador();
  const utilizadorId = utilizadorSessao?.id;

  const [utilizador, setUtilizador] = useState(utilizadorSessao);
  const [loading, setLoading] = useState(Boolean(utilizadorId));
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!utilizadorId) {
      return undefined;
    }

    let componenteAtivo = true;

    api
      .get(`/utilizadores/obter/${utilizadorId}`)
      .then((response) => {
        if (!componenteAtivo) {
          return;
        }

        if (response.data.success) {
          setUtilizador(response.data.data);
          setErro("");
        } else {
          setErro("Não foi possível carregar os dados do perfil.");
        }
      })
      .catch(() => {
        if (componenteAtivo) {
          setErro(
            "Não foi possível atualizar os dados do perfil. Estão a ser mostrados os dados guardados na sessão."
          );
        }
      })
      .finally(() => {
        if (componenteAtivo) {
          setLoading(false);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, [utilizadorId]);

  function formatarData(data) {
    if (!data) {
      return "Não disponível";
    }

    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(data));
  }

  function obterIniciais() {
    if (!utilizador?.name) {
      return "U";
    }

    return utilizador.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join("");
  }

  function handleLogout() {
    limparCarrinhoVisitante();
    terminarSessao();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div
        className="container"
        style={{ maxWidth: "900px" }}
      >
        <div className="mb-4">
          <span className="badge bg-primary-subtle text-primary mb-3">
            Área do comprador
          </span>

          <h1 className="fw-bold mb-2">
            O meu perfil
          </h1>

          <p className="text-muted mb-0">
            Consulta os dados associados à tua conta StyleMarket.
          </p>
        </div>

        {erro && (
          <div className="alert alert-warning">
            {erro}
          </div>
        )}

        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="card-body p-4 p-md-5">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">
                    A carregar...
                  </span>
                </div>

                <p className="text-muted mt-3 mb-0">
                  A carregar os dados do perfil...
                </p>
              </div>
            ) : (
              <>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-5">
                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold fs-3"
                    style={{
                      width: "78px",
                      height: "78px",
                    }}
                  >
                    {obterIniciais()}
                  </div>

                  <div>
                    <h2 className="h4 fw-bold mb-1">
                      {utilizador?.name || "Comprador"}
                    </h2>

                    <p className="text-muted mb-0">
                      Conta de comprador
                    </p>
                  </div>

                  <span
                    className={`badge ms-md-auto px-3 py-2 ${
                      utilizador?.isActive === false
                        ? "bg-danger-subtle text-danger"
                        : "bg-success-subtle text-success"
                    }`}
                  >
                    {utilizador?.isActive === false
                      ? "Inativa"
                      : "Ativa"}
                  </span>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100 bg-light">
                      <small className="text-muted d-block mb-1">
                        Nome completo
                      </small>

                      <strong>
                        {utilizador?.name || "Não disponível"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100 bg-light">
                      <small className="text-muted d-block mb-1">
                        Email
                      </small>

                      <strong>
                        {utilizador?.email || "Não disponível"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100 bg-light">
                      <small className="text-muted d-block mb-1">
                        Perfil
                      </small>

                      <strong>
                        Comprador
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100 bg-light">
                      <small className="text-muted d-block mb-1">
                        Data de registo
                      </small>

                      <strong>
                        {formatarData(utilizador?.createdAt)}
                      </strong>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-between">
                  <Link
                    to="/catalogo"
                    className="btn btn-outline-primary"
                  >
                    Voltar ao catálogo
                  </Link>

                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Terminar sessão
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilComprador;
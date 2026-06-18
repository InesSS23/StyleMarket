import { useEffect, useState } from "react";

import api from "../../services/api";
import { obterUtilizador } from "../../utils/authUtils";

function PerfilVendedor() {
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
          setErro(
            "Não foi possível carregar os dados do perfil."
          );
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
    const nome = utilizador?.storeName || utilizador?.name;

    if (!nome) {
      return "V";
    }

    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join("");
  }

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">

        <h1 className="fw-bold mb-2">
          Perfil da loja
        </h1>

        <p className="text-muted mb-0">
          Consulta os dados da conta e as informações públicas da loja.
        </p>
      </div>

      {erro && (
        <div className="alert alert-warning">
          {erro}
        </div>
      )}

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-body p-4 p-xl-5">
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
                    {utilizador?.storeName || "Loja sem nome"}
                  </h2>

                  <p className="text-muted mb-0">
                    Responsável:{" "}
                    {utilizador?.name || "Não disponível"}
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
                      Nome do responsável
                    </small>

                    <strong>
                      {utilizador?.name || "Não disponível"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      Email da conta
                    </small>

                    <strong>
                      {utilizador?.email || "Não disponível"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      Nome público da loja
                    </small>

                    <strong>
                      {utilizador?.storeName || "Não disponível"}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      Contacto da loja
                    </small>

                    <strong>
                      {utilizador?.storeContact || "Não indicado"}
                    </strong>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      Descrição da loja
                    </small>

                    <p className="mb-0 fw-medium">
                      {utilizador?.storeDescription ||
                        "Ainda não foi adicionada uma descrição à loja."}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      Perfil
                    </small>

                    <strong>
                      Vendedor
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilVendedor;
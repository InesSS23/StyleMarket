import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function GerirUtilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregarUtilizadores = useCallback(() => {
    setCarregando(true);
    setErro("");

    api
      .get("/utilizadores/listar")
      .then((response) => {
        if (response.data.success) {
          setUtilizadores(response.data.data);
        }
      })
      .catch((error) => {
        setErro(
          error.response?.data?.message ||
            "Erro ao carregar utilizadores."
        );
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(carregarUtilizadores, 0);
    return () => clearTimeout(timer);
  }, [carregarUtilizadores]);

  const utilizadoresFiltrados = useMemo(() => {
    const texto = pesquisa.trim().toLowerCase();

    return utilizadores.filter((utilizador) => {
      const correspondePesquisa =
        !texto ||
        utilizador.name?.toLowerCase().includes(texto) ||
        utilizador.email?.toLowerCase().includes(texto) ||
        utilizador.storeName?.toLowerCase().includes(texto);

      const correspondePerfil =
        !perfilSelecionado ||
        utilizador.role === perfilSelecionado;

      return correspondePesquisa && correspondePerfil;
    });
  }, [utilizadores, pesquisa, perfilSelecionado]);

  function nomePerfil(role) {
    if (role === "vendedor") return "Vendedor";
    if (role === "admin") return "Administrador";
    return "Comprador";
  }

  function perfilClass(role) {
    if (role === "vendedor") {
      return "admin-badge admin-badge--blue";
    }

    if (role === "admin") {
      return "admin-badge admin-badge--purple";
    }

    return "admin-badge admin-badge--gray";
  }

  function estadoClass(isActive) {
    if (isActive) {
      return "admin-badge admin-badge--green";
    }

    return "admin-badge admin-badge--gray";
  }

  function obterInicial(utilizador) {
    const nome = utilizador.storeName || utilizador.name || "U";
    return nome.trim().charAt(0).toUpperCase();
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-PT");
  }

  function verUtilizador(utilizador) {
    const nomeLoja = utilizador.storeName
      ? `\nNome do vendedor/loja: ${utilizador.storeName}`
      : "";

    const contactoLoja = utilizador.storeContact
      ? `\nContacto público: ${utilizador.storeContact}`
      : "";

    window.alert(
      `Utilizador #${utilizador.id}\n` +
        `Nome: ${utilizador.name}\n` +
        `Email: ${utilizador.email}\n` +
        `Perfil: ${nomePerfil(utilizador.role)}\n` +
        `Estado: ${utilizador.isActive ? "Ativo" : "Inativo"}` +
        nomeLoja +
        contactoLoja +
        `\nRegistado em: ${formatarData(utilizador.createdAt)}`
    );
  }

  function editarUtilizador(utilizador) {
    const novoNome = window.prompt(
      "Nome do utilizador:",
      utilizador.name
    );

    if (novoNome === null) return;

    const novoEmail = window.prompt(
      "Email do utilizador:",
      utilizador.email
    );

    if (novoEmail === null) return;

    const novoPerfil = window.prompt(
      "Perfil: comprador, vendedor ou admin",
      utilizador.role
    );

    if (novoPerfil === null) return;

    const perfilNormalizado = novoPerfil.trim().toLowerCase();

    if (!["comprador", "vendedor", "admin"].includes(perfilNormalizado)) {
      window.alert("O perfil indicado não é válido.");
      return;
    }

    let novoNomeLoja = utilizador.storeName || "";

    if (perfilNormalizado === "vendedor") {
      const respostaNomeLoja = window.prompt(
        "Nome público do vendedor ou da loja:",
        utilizador.storeName || utilizador.name
      );

      if (respostaNomeLoja === null) return;
      novoNomeLoja = respostaNomeLoja;
    }

    api
      .put(`/utilizadores/atualizar/${utilizador.id}`, {
        name: novoNome,
        email: novoEmail,
        role: perfilNormalizado,
        storeName: novoNomeLoja,
        storeDescription: utilizador.storeDescription || "",
        storeContact: utilizador.storeContact || "",
      })
      .then((response) => {
        if (response.data.success) {
          setMensagem("Utilizador atualizado com sucesso.");
          carregarUtilizadores();
        }
      })
      .catch((error) => {
        window.alert(
          error.response?.data?.message ||
            "Erro ao atualizar utilizador."
        );
      });
  }

  function alterarEstado(utilizador) {
    const acao = utilizador.isActive ? "desativar" : "ativar";

    if (
      !window.confirm(
        `Tens a certeza que queres ${acao} esta conta?`
      )
    ) {
      return;
    }

    api
      .patch(`/utilizadores/alterar-estado/${utilizador.id}`)
      .then((response) => {
        if (response.data.success) {
          setMensagem(response.data.message);
          carregarUtilizadores();
        }
      })
      .catch((error) => {
        window.alert(
          error.response?.data?.message ||
            "Erro ao alterar o estado do utilizador."
        );
      });
  }

  function apagarUtilizador(utilizador) {
    if (
      !window.confirm(
        `Tens a certeza que queres apagar a conta de ${utilizador.name}?`
      )
    ) {
      return;
    }

    api
      .delete(`/utilizadores/apagar/${utilizador.id}`)
      .then((response) => {
        if (response.data.success) {
          setMensagem("Utilizador apagado com sucesso.");
          carregarUtilizadores();
        }
      })
      .catch((error) => {
        window.alert(
          error.response?.data?.message ||
            "Erro ao apagar utilizador."
        );
      });
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Utilizadores</h1>
        <p>Gere todos os utilizadores registados na plataforma.</p>
      </div>

      <div className="admin-filter-card">
        <input
          type="text"
          placeholder="Pesquisar por nome, loja ou email..."
          className="admin-search-input"
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
        />

        <select
          className="admin-select"
          value={perfilSelecionado}
          onChange={(event) =>
            setPerfilSelecionado(event.target.value)
          }
        >
          <option value="">Todos os Perfis</option>
          <option value="admin">Administrador</option>
          <option value="vendedor">Vendedor</option>
          <option value="comprador">Comprador</option>
        </select>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {mensagem && (
        <div className="alert alert-success">{mensagem}</div>
      )}

      <p className="admin-results-text">
        A mostrar {utilizadoresFiltrados.length} utilizadores
      </p>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Estado</th>
              <th>Data de Registo</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  A carregar utilizadores...
                </td>
              </tr>
            )}

            {!carregando &&
              utilizadoresFiltrados.map((utilizador) => (
                <tr key={utilizador.id}>
                  <td>#{utilizador.id}</td>

                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-avatar">
                        {obterInicial(utilizador)}
                      </span>

                      <span>
                        {utilizador.role === "vendedor"
                          ? utilizador.storeName || utilizador.name
                          : utilizador.name}
                      </span>
                    </div>
                  </td>

                  <td>{utilizador.email}</td>

                  <td>
                    <span className={perfilClass(utilizador.role)}>
                      {nomePerfil(utilizador.role)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={estadoClass(utilizador.isActive)}
                    >
                      {utilizador.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td>{formatarData(utilizador.createdAt)}</td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="admin-action admin-action--blue"
                        title="Ver utilizador"
                        onClick={() => verUtilizador(utilizador)}
                      >
                        👁
                      </button>

                      <button
                        type="button"
                        className="admin-action admin-action--dark"
                        title="Editar utilizador"
                        onClick={() => editarUtilizador(utilizador)}
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        className="admin-action admin-action--yellow"
                        title={
                          utilizador.isActive
                            ? "Desativar utilizador"
                            : "Ativar utilizador"
                        }
                        onClick={() => alterarEstado(utilizador)}
                      >
                        ⊘
                      </button>

                      <button
                        type="button"
                        className="admin-action admin-action--red"
                        title="Apagar utilizador"
                        onClick={() => apagarUtilizador(utilizador)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!carregando && utilizadoresFiltrados.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Não foram encontrados utilizadores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default GerirUtilizadores;
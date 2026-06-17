import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function GerirUtilizadores() {
  const [pesquisa, setPesquisa] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [utilizadores, setUtilizadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let componenteAtivo = true;

    api
      .get("/utilizadores/listar")
      .then((response) => {
        if (!componenteAtivo) {
          return;
        }

        if (response.data.success) {
          setUtilizadores(response.data.data);
          setErro("");
        } else {
          setErro("Erro ao carregar utilizadores.");
        }
      })
      .catch((error) => {
        if (componenteAtivo) {
          setErro(
            error.response?.data?.message ||
              "Erro ao carregar utilizadores."
          );
        }
      })
      .finally(() => {
        if (componenteAtivo) {
          setCarregando(false);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, []);

  const utilizadoresFiltrados = useMemo(() => {
    const texto = pesquisa.trim().toLowerCase();
    const perfil = perfilSelecionado.trim().toLowerCase();

    return utilizadores.filter((user) => {
      const correspondePesquisa =
        !texto ||
        user.name?.toLowerCase().includes(texto) ||
        user.email?.toLowerCase().includes(texto) ||
        user.storeName?.toLowerCase().includes(texto);

      const correspondePerfil =
        !perfil || user.role?.toLowerCase() === perfil;

      return correspondePesquisa && correspondePerfil;
    });
  }, [utilizadores, pesquisa, perfilSelecionado]);

  function perfilClass(perfil) {
    if (perfil?.toLowerCase() === "vendedor") {
      return "admin-badge admin-badge--blue";
    }

    if (perfil?.toLowerCase() === "admin") {
      return "admin-badge admin-badge--purple";
    }

    return "admin-badge admin-badge--gray";
  }

  function estadoClass(ativo) {
    if (ativo) {
      return "admin-badge admin-badge--green";
    }

    return "admin-badge admin-badge--gray";
  }

  function nomePerfil(perfil) {
    if (perfil === "admin") {
      return "Administrador";
    }

    if (perfil === "vendedor") {
      return "Vendedor";
    }

    return "Comprador";
  }

  async function alterarEstado(user) {
    const acao = user.isActive ? "desativar" : "ativar";

    if (!window.confirm(`Deseja ${acao} este utilizador?`)) {
      return;
    }

    try {
      const response = await api.patch(
        `/utilizadores/alterar-estado/${user.id}`
      );

      if (response.data.success) {
        setUtilizadores((listaAtual) =>
          listaAtual.map((item) =>
            item.id === user.id ? response.data.data : item
          )
        );
        setErro("");
      } else {
        window.alert(
          response.data.message || "Erro ao alterar o estado."
        );
      }
    } catch (error) {
      window.alert(
        error.response?.data?.message ||
          "Erro ao alterar o estado do utilizador."
      );
    }
  }

  async function apagarUtilizador(user) {
    if (!window.confirm(`Deseja apagar o utilizador ${user.name}?`)) {
      return;
    }

    try {
      const response = await api.delete(
        `/utilizadores/apagar/${user.id}`
      );

      if (response.data.success) {
        setUtilizadores((listaAtual) =>
          listaAtual.filter((item) => item.id !== user.id)
        );
        setErro("");
      } else {
        window.alert(
          response.data.message || "Erro ao apagar utilizador."
        );
      }
    } catch (error) {
      window.alert(
        error.response?.data?.message ||
          "Erro ao apagar o utilizador."
      );
    }
  }

  function verUtilizador(user) {
    const detalhesLoja =
      user.role === "vendedor"
        ? `\nNome da loja: ${user.storeName || "Não indicado"}` +
          `\nContacto: ${user.storeContact || "Não indicado"}` +
          `\nDescrição: ${
            user.storeDescription || "Não indicada"
          }`
        : "";

    window.alert(
      `Utilizador #${user.id}\n` +
        `Nome: ${user.name}\n` +
        `Email: ${user.email}\n` +
        `Perfil: ${nomePerfil(user.role)}\n` +
        `Estado: ${user.isActive ? "Ativo" : "Inativo"}\n` +
        `Registado em: ${new Date(user.createdAt).toLocaleDateString(
          "pt-PT"
        )}` +
        detalhesLoja
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Utilizadores</h1>
        <p>
          Consulta, ativa ou desativa e remove utilizadores da
          plataforma.
        </p>
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
          onChange={(event) => setPerfilSelecionado(event.target.value)}
        >
          <option value="">Todos os Perfis</option>
          <option value="admin">Administrador</option>
          <option value="vendedor">Vendedor</option>
          <option value="comprador">Comprador</option>
        </select>
      </div>

      <p className="admin-results-text">
        A mostrar {utilizadoresFiltrados.length} utilizadores
      </p>

      {erro && <div className="alert alert-danger">{erro}</div>}

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
            {carregando ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  A carregar utilizadores...
                </td>
              </tr>
            ) : utilizadoresFiltrados.length > 0 ? (
              utilizadoresFiltrados.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>

                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-avatar">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                      <span>{user.storeName || user.name}</span>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className={perfilClass(user.role)}>
                      {nomePerfil(user.role)}
                    </span>
                  </td>

                  <td>
                    <span className={estadoClass(user.isActive)}>
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td>
                    {new Date(user.createdAt).toLocaleDateString(
                      "pt-PT"
                    )}
                  </td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="admin-action admin-action--blue"
                        title="Ver detalhes do utilizador"
                        onClick={() => verUtilizador(user)}
                      >
                        👁
                      </button>

                      <button
                        type="button"
                        className="admin-action admin-action--yellow"
                        title={
                          user.isActive
                            ? "Desativar utilizador"
                            : "Ativar utilizador"
                        }
                        onClick={() => alterarEstado(user)}
                      >
                        ⊘
                      </button>

                      <button
                        type="button"
                        className="admin-action admin-action--red"
                        title="Apagar utilizador"
                        onClick={() => apagarUtilizador(user)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
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

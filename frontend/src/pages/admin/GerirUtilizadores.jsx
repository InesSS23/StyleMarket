import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function GerirUtilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [perfilFiltro, setPerfilFiltro] = useState("Todos");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  function carregarUtilizadores() {
    setCarregando(true);
    setErro("");

    api
      .get("/utilizadores/listar")
      .then((response) => {
        if (response.data.success) {
          setUtilizadores(response.data.data);
        } else {
          setErro("Não foi possível carregar os utilizadores.");
        }
      })
      .catch(() => {
        setErro("Erro ao carregar os utilizadores.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  const utilizadoresFiltrados = useMemo(() => {
    const pesquisa = searchTerm.trim().toLowerCase();

    return utilizadores.filter((user) => {
      const correspondePesquisa =
        !pesquisa ||
        user.name.toLowerCase().includes(pesquisa) ||
        user.email.toLowerCase().includes(pesquisa);

      const correspondePerfil =
        perfilFiltro === "Todos" ||
        (perfilFiltro === "Administrador" && user.role === "admin") ||
        (perfilFiltro === "Vendedor" && user.role === "vendedor") ||
        (perfilFiltro === "Comprador" && user.role === "comprador");

      return correspondePesquisa && correspondePerfil;
    });
  }, [utilizadores, searchTerm, perfilFiltro]);

  function perfilClass(role) {
    if (role === "admin") return "admin-badge admin-badge--purple";
    if (role === "vendedor") return "admin-badge admin-badge--blue";
    return "admin-badge admin-badge--gray";
  }

  function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-PT");
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
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Pesquisar por nome ou email..."
          className="admin-search-input"
        />

        <select
          className="admin-select"
          value={perfilFiltro}
          onChange={(event) => setPerfilFiltro(event.target.value)}
        >
          <option>Todos</option>
          <option>Administrador</option>
          <option>Vendedor</option>
          <option>Comprador</option>
        </select>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <p className="admin-results-text">
        A mostrar {utilizadoresFiltrados.length} de {utilizadores.length} utilizadores
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
              utilizadoresFiltrados.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>

                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                      <span>{user.name}</span>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className={perfilClass(user.role)}>
                      {user.role === "admin"
                        ? "Administrador"
                        : user.role === "vendedor"
                        ? "Vendedor"
                        : "Comprador"}
                    </span>
                  </td>

                  <td>
                    <span className="admin-badge admin-badge--green">Ativo</span>
                  </td>

                  <td>{formatarData(user.createdAt)}</td>

                  <td>
                    <div className="admin-action-buttons">
                      <button className="admin-action admin-action--blue">👁</button>
                      <button className="admin-action admin-action--dark">✎</button>
                      <button className="admin-action admin-action--yellow">⊘</button>
                      <button className="admin-action admin-action--red">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}

            {!carregando && utilizadoresFiltrados.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Nenhum utilizador encontrado.
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
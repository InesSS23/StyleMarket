export function guardarUtilizador(user, lembrar) {
  const dados = JSON.stringify(user);

  if (lembrar) {
    localStorage.setItem("utilizador", dados);
    sessionStorage.removeItem("utilizador");
  } else {
    sessionStorage.setItem("utilizador", dados);
    localStorage.removeItem("utilizador");
  }
}

export function obterUtilizador() {
  const utilizadorLocal = localStorage.getItem("utilizador");
  const utilizadorSessao = sessionStorage.getItem("utilizador");

  if (utilizadorLocal) {
    return JSON.parse(utilizadorLocal);
  }

  if (utilizadorSessao) {
    return JSON.parse(utilizadorSessao);
  }

  return null;
}

export function terminarSessao() {
  localStorage.removeItem("utilizador");
  sessionStorage.removeItem("utilizador");
}

export function estaAutenticado() {
  return obterUtilizador() !== null;
}

export function temPerfil(perfisPermitidos) {
  const utilizador = obterUtilizador();

  if (!utilizador) {
    return false;
  }

  return perfisPermitidos.includes(utilizador.role);
}
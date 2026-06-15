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
  const dadosGuardados =
    localStorage.getItem("utilizador") ||
    sessionStorage.getItem("utilizador");

  if (!dadosGuardados) {
    return null;
  }

  try {
    return JSON.parse(dadosGuardados);
  } catch {
    localStorage.removeItem("utilizador");
    sessionStorage.removeItem("utilizador");
    return null;
  }
}

export function obterIdVendedor() {
  const utilizador = obterUtilizador();

  if (!utilizador || utilizador.role !== "vendedor") {
    return null;
  }

  return Number(utilizador.id);
}

export function terminarSessao() {
  localStorage.removeItem("utilizador");
  sessionStorage.removeItem("utilizador");
}
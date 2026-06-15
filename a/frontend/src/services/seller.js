import { obterUtilizador } from "../utils/authUtils";

export function getSellerId() {
  const utilizador = obterUtilizador();

  if (!utilizador || utilizador.role !== "vendedor") {
    return null;
  }

  return Number(utilizador.id);
}
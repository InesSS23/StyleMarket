import axios from "axios";

/*
  Este ficheiro centraliza a ligação ao backend.
  Assim, se a URL da API mudar, só alteramos neste local.
*/

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export default api;
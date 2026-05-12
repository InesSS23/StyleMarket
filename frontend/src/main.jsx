import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";
import App from "./App.jsx";

/*
  Este ficheiro é o ponto de entrada da aplicação React.
  Aqui importamos o Bootstrap e renderizamos o componente principal App.
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
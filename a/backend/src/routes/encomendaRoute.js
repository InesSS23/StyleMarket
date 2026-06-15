const express = require("express");
const router = express.Router();

const encomendaController = require("../controllers/encomendaController");

/* Rotas das encomendas */
router.get("/listar", encomendaController.listar);
router.get("/obter/:id", encomendaController.obter);
router.get("/listar/vendedor/:sellerId", encomendaController.listarPorVendedor);
router.post("/criar", encomendaController.criar);

module.exports = router;
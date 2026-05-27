const express = require("express");
const router = express.Router();

const encomendaController = require("../controllers/encomendaController");

router.get("/listar", encomendaController.listar);
router.get("/listar/vendedor/:sellerId", encomendaController.listarPorVendedor);

module.exports = router;

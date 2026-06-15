const express = require("express");
const router = express.Router();

const produtoController = require("../controllers/produtoController");

/* Rotas dos produtos */
router.get("/listar", produtoController.listar);
router.get("/listar/vendedor/:sellerId", produtoController.listarPorVendedor);
router.get("/obter/:id", produtoController.obter);
router.post("/criar", produtoController.criar);
router.post("/verificar-stock", produtoController.verificarStock);
router.put("/atualizar/:id", produtoController.atualizar);
router.delete("/apagar/:id", produtoController.apagar);


module.exports = router;
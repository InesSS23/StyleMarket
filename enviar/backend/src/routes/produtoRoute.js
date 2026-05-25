const express = require("express");
const router = express.Router();

const produtoController = require("../controllers/produtoController");

/* Rotas dos produtos */
router.get("/listar", produtoController.listar);
router.get("/obter/:id", produtoController.obter);
router.post("/criar", produtoController.criar);
router.put("/atualizar/:id", produtoController.atualizar);
router.delete("/apagar/:id", produtoController.apagar);

module.exports = router;
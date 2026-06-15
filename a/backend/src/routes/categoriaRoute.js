const express = require("express");
const router = express.Router();

const categoriaController = require("../controllers/categoriaController");

/* Rotas das categorias */
router.get("/listar", categoriaController.listar);
router.get("/obter/:id", categoriaController.obter);
router.post("/criar", categoriaController.criar);
router.put("/atualizar/:id", categoriaController.atualizar);
router.delete("/apagar/:id", categoriaController.apagar);

module.exports = router;
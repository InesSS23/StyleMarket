const express = require("express");
const router = express.Router();

const utilizadorController = require("../controllers/utilizadorController");

router.get("/listar", utilizadorController.listar);
router.get("/obter/:id", utilizadorController.obter);
router.put("/atualizar/:id", utilizadorController.atualizar);
router.patch("/alterar-estado/:id", utilizadorController.alterarEstado);
router.delete("/apagar/:id", utilizadorController.apagar);

module.exports = router;
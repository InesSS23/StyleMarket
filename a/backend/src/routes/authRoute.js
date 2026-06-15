const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

/* Rotas de autenticação */
router.post("/registar", authController.registar);
router.post("/login", authController.login);

module.exports = router;
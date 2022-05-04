/****** Modules nécessaires */
const express = require("express");
let router = express.Router(); // Création d'un router Express

const userCtrl = require('../controllers/user') 

/******* Routage de la ressource User */
router.post("/auth/signup", userCtrl.signup);

router.post("/auth/login", userCtrl.login);


module.exports = router;

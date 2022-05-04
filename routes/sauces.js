/****** Modules nécessaires */
const express = require("express");
let router = express.Router(); // Création d'un router Express

const auth = require("../middleware/auth")
const multer =require("../middleware/multer-config")
const sauceCtrl = require("../controllers/sauces");

/******* Routage de la ressource sauces */
router.get("/sauces", auth, sauceCtrl.getAllSauces);

router.get("/sauces/:id", auth, sauceCtrl.getOneSauce);

router.post("/sauces", auth, multer, sauceCtrl.addSauces);

router.put("/sauces/:id", auth, multer, sauceCtrl.updateSauce);

router.delete("/sauces/:id", auth, sauceCtrl.deleteSauce);

router.post("/sauces/:id/like", auth, sauceCtrl.likeSauce);


module.exports = router;

/********* modules nécessaires */
const multer = require("multer"); // package de gestion des fichiers 

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({ 
  // Où enregistrer le fichier
destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Nom du fichier 
filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({storage: storage}).single('image') // uniquement les fichiers "image"
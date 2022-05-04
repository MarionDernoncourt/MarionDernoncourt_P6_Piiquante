/*********** Modules necessaires */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const path = require("path"); // provides utilities for working with file and directory paths

const app = express(); // création de l'application Express

/*********** Démarrage server avec l'API*/
app.use(
  cors({
    origin: "*", /// autorise toutes origines
    methods: ["GET", "PUT", "POST", "DELETE"], // autorise uniquement ces requêtes
  })
);
app.use(express.json()); // api utilise json / réponse
app.use(express.urlencoded({ extended: true })); // api comprend json / lecture

/*********** Import des modules de routage*/
const users_router = require("./routes/users");
const sauces_router = require("./routes/sauces");

/********** Mise en place routage */
/******************************** */
app.use("/images", express.static(path.join(__dirname, "images"))); // indique comment traiter les requetes vers images

app.use("/api", users_router);

app.use("/api", sauces_router);

app.all("*", (req, res) =>
  res.status(501).send("Ressource inexistante")
);

// Connexion à la bdd MongoDb + Lancement du serveur
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.prppn.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      // Lancement du serveur sur le SERVER_PORT
      console.log(`Running on ${process.env.SERVER_PORT} !`);
    });
  })
  .catch((err) => console.log("Connexion à MongoDB échouée ! ", err));

/****** modules nécessaires */
const fs = require("fs"); // file system, permet de modifier le systeme de fichier (dont la suppression)

const Sauce = require("../models/sauce"); // import du model sauce

exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.json(sauces))
    .catch((err) => res.status(500).json(err));
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((err) => res.status(500).json(err));
};

exports.addSauces = (req, res) => {
  // transformation en object JS exploitable
  const sauceObject = JSON.parse(req.body.sauce);
  // Création de la nouvelle sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: "[]",
    usersDisliked: "[]",
  });
  // Sauvegarde de la nouvelle sauce
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce créée !" }))
    .catch((error) => res.status(500).json(error));
};

exports.updateSauce = (req, res) => {
  //Vérification si id présent et cohérent
  const sauceId = req.params.id;
  if (!sauceId) {
    return res.status(400).json({ message: "missing parameters" });
  }
  // transforme en objet JS exploitable
  const sauceObject = req.file
    ? {
        // si une image est modifiée
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // sans image a modifier
  // Modification de la sauce
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((err) => res.status(500).json(err));
};

exports.deleteSauce = (req, res) => {
  // Vérification si id sélectionné est cohérent
  const sauceId = req.params.id;
  if (!sauceId) {
    return res.status(400).json({ message: "missing parameters" });
  }
  // recherche la sauce pour XX l'image du serveur
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; // Nom du fichier a supprimer
      fs.unlink(`images/${filename}`, () => {
        // supprime l'image de notre fichier et callback pour supprimer la sauce
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((err) => res.status(500).json(err));
      });
    })
    .catch((err) => res.status(500).json(err));
};

exports.likeSauce = (req, res) => {
  //// si utilisateur ajoute un LIKE
  if (parseInt(req.body.like) === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: " Like's saved" }))
      .catch((err) => res.status(500).json(err));
  }
  //// si utilisateur ajoute un DISLIKE
  else if (parseInt(req.body.like) === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: " UnLike's saved" }))
      .catch((err) => res.status(500).json(err));
  }
  //// si utilisateur retire son LIKE ou DISLIKE
  else if (parseInt(req.body.like) === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        // Si utilisateur dans usersLiked
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
          )
            .then(() => res.status(200).json({ message: "Like's updated !" }))
            .catch((err) => res.status(500).json(err));
        }
        // Si utilisateur dans usersDisliked
        else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
            .then(() => res.status(200).json({ message: "Unlike's updated !" }))
            .catch((err) => res.status(500).json(err));
        }
      })
      .catch((err) => res.status(500).json(err));
  }
};

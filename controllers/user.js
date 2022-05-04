/************ Modules nécessaires */
const bcrypt = require("bcrypt"); // fonction de hashage
const jwt = require("jsonwebtoken"); //decode, verify and generate JWT


const User = require("../models/user"); // import du model user

exports.signup = async (req, res) => {
  // Vérification des données
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Missing Data !" });
  }
  try {
    let user = await User.findOne({ email: req.body.email });

    // Verification utilisateur n'existe pas
    if (user !== null) {
      return res.status(409).json({ message: "This email already exists !" });
    }

    // Hashage du mot de passe
    let hash = await bcrypt.hash(
      req.body.password,
      parseInt(process.env.BCRYPT_SALT_ROUND)
    );
    req.body.password = hash;

    //Création du nouvel utilisateur
    let newUser = await User.create({
      email: req.body.email,
      password: hash,
    });
    return res.json({ message: "User Created" });
  } catch {
    return res.status(500).json( error );
  }
};

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }); // Récupération du user par son email
    // Verification utilisateur existe
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }
    // Vérification du mot de passe
    let valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    }
    // Génération du token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_DURATION }
    );
    return res.json({ userId: user._id, token: token });
  } catch {
    res.status(500).json( error );
  }
};

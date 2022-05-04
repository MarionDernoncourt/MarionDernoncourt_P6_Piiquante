const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récuperation du token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Décodage du token
    const userId = decodedToken.userId; // Récupération du user Id
    // Vérification userId identique au userId du token 
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: "Invalid request!",
    });
  }
};

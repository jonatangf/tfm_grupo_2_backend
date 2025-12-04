const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const log = (...args) => console.log("[AuthMiddleware]", ...args);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    log("No token provided to request " + req.originalUrl);
    return res.status(401).json({error: "Token de autenticación requerido"});
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      log("Invalid token", {error: err.message});
      return res.status(403).json({error: "Token inválido o expirado"});
    }

    req.user = decoded;
    log("Token verified", {userId: decoded.userId});
    next();
  });
};

module.exports = authenticateToken;
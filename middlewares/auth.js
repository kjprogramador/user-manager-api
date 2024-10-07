import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No hay token, permiso no válido" });
  }

  // Extraer el token después de "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token no válido" });
  }
};

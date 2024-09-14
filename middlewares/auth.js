import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ mensaje: "No hay token, permiso denegado" });
  }

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

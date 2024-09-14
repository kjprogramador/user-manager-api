export const validateRole = (rolRequired) => {
  return (req, res, next) => {
    if (req.user.role !== rolRequired) {
      return res.status(403).json({
        mensaje: "Acceso denegado: No tienes los permisos necesarios",
      });
    }
    next();
  };
};

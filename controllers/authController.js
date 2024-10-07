import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const loginUser = async (req, res) => {
  // Verificar si hay errores de validación
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: "Error en la validación de los datos",
      details: errores.array(),
    });
  }

  const { email, password } = req.body;

  try {
    // Convertir el email a minúsculas para asegurar la consistencia
    const emailLowerCase = email.toLowerCase();

    // Verificar si el usuario existe
    let usuario = await User.findOne({ where: { email: emailLowerCase } });

    if (!usuario) {
      return res.status(404).json({
        error: true,
        message: "El usuario o la contraseña son incorrectos",
      });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(404).json({
        error: true,
        message: "El usuario o la contraseña son incorrectos",
      });
    }

    // Generar token JWT
    const payload = { id: usuario.id, role: usuario.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expira en 1 hora
    });

    res.json({ error: false, message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error en el servidor. Inténtalo más tarde.",
    });
  }
};

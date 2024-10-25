import { User } from "../models/index.js";

import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      message: "Error en la validación de los datos",
      details: errores.array(),
    });
  }

  try {
    const { name, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // Ejemplo con bcrypt
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // Rol básico asignado automáticamente
    });

    res
      .status(201)
      .json({ message: "Usuario registrado con éxito", data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

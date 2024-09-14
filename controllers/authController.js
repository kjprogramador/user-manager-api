import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    let usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res
        .status(400)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    // Generar token JWT
    const payload = { id: usuario.id, role: usuario.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expira en 1 hora
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

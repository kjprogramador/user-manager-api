import { validationResult } from "express-validator";
import { User } from "../models/index.js";
import { getPaginatedUsers } from "../services/userService.js";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;

    // Llamar al servicio para obtener los usuarios paginados
    const result = await getPaginatedUsers(page, limit, role);

    if (!result.data.length === 0) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Ocurrió un error en el servidor. Por favor, inténtalo más tarde.",
    });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.findByPk(id);

    if (!usuario)
      return res
        .status(404)
        .json({ error: true, message: "Usuario no encontrado" });

    res.json({
      error: false,
      message: "Usuario encontrado exitosamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error en el servidor. Inténtalo más tarde.",
    });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  // Verificar si hay errores de validación
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: "Error en la validación de los datos",
      details: errores.array(),
    });
  }

  const { name, email, password, role } = req.body;
  try {
    // Convertir el email a minúsculas
    const emailLowerCase = email.toLowerCase();

    // Verificar si el usuario ya existe
    let usuario = await User.findOne({ where: { email } });
    if (usuario) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario con la contraseña encriptada
    usuario = await User.create({
      name,
      email: emailLowerCase,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      error: false,
      message: "Usuario creado exitosamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error en el servidor. Inténtalo más tarde.",
    });
  }
};

// Actualizar un usuario existente
export const updateUser = async (req, res) => {
  // Verificar si hay errores de validación
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: "Error en la validación de los datos",
      details: errores.array(),
    });
  }

  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const usuario = await User.findByPk(id);
    if (!usuario)
      return res
        .status(404)
        .json({ error: true, mensaje: "Usuario no encontrado" });

    // Si se incluye un nuevo password, lo encriptamos
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Convertir email a minúsculas si fue enviado
    const emailLowerCase = email ? email.toLowerCase() : usuario.email;

    // Actualizar los campos que hayan sido enviados
    usuario.name = name || usuario.name;
    usuario.email = emailLowerCase;
    usuario.password = hashedPassword || usuario.password;
    usuario.role = role || usuario.role;

    await usuario.save();

    res.json({
      error: false,
      message: "Usuario actualizado exitosamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      mensaje: "Error en el servidor. Inténtalo más tarde.",
    });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await User.destroy({ where: { id } });
    if (resultado === 0)
      return res
        .status(404)
        .json({ error: true, message: "Usuario no encontrado" });

    res.json({
      error: false,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error en el servidor. Inténtalo más tarde.",
    });
  }
};

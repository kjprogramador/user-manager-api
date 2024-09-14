import { User } from "../models/index.js";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los usuarios" });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.findByPk(id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el usuario" });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  const { name, email, password, rol } = req.body;
  try {
    // Verificar si el usuario ya existe
    let usuario = await User.findOne({ where: { email } });
    if (usuario) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario con la contraseña encriptada
    usuario = await User.create({
      name,
      email,
      password: hashedPassword,
      rol: rol || "user",
    });

    res.json({ mensaje: "Usuario creado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el usuario" });
  }
};

// Actualizar un usuario existente
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const usuario = await User.findByPk(id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    usuario.name = name;
    usuario.email = email;
    usuario.password = password;
    await usuario.save();

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el usuario" });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await User.destroy({ where: { id } });
    if (resultado === 0)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el usuario" });
  }
};

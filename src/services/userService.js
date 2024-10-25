import { User } from "../models/index.js";

export const getPaginatedUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // Obtener usuarios con paginación
  const users = await User.findAndCountAll({
    attributes: ["name", "email", "role"], // Solo los campos que queremos mostrar
    limit: parseInt(limit),
    offset: parseInt(offset), // Este parámetro define cuántas filas quieres "saltar" antes de empezar a devolver resultados.
  });

  // Verificar si hay usuarios
  if (users.rows.length === 0) {
    return {
      success: false,
      message: "No se encontraron usuarios.",
      data: [],
    };
  }

  return {
    success: true,
    totalItems: users.count,
    totalPages: Math.ceil(users.count / limit),
    currentPage: parseInt(page),
    data: users.rows,
  };
};

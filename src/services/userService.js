import { User } from "../models/index.js";

export const getPaginatedUsers = async (page = 1, limit = 10, role = null) => {
  const offset = (page - 1) * limit;

  const options = {
    attributes: ["name", "email", "role"], // Solo los campos que queremos mostrar
    limit: parseInt(limit),
    offset: parseInt(offset), // Este parámetro define cuántas filas quieres "saltar" antes de empezar a devolver resultados.
  };

  // Agregar el filtro por rol si se especifica
  if (role) {
    options.where = { role };
  }

  // Obtener usuarios con paginación
  const users = await User.findAndCountAll(options);

  // Verificar si hay usuarios
  if (users.rows.length === 0) {
    return {
      message: "No se encontraron usuarios.",
      data: [],
    };
  }

  return {
    totalItems: users.count,
    totalPages: Math.ceil(users.count / limit),
    currentPage: parseInt(page),
    data: users.rows,
  };
};

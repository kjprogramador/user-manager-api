import { Sequelize } from "sequelize";
import { dbConfig } from "../config/db.js";
import UserModel from "./userModel.js";

// Inicializar Sequelize
export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

// Inicializar el modelo de Usuario
export const User = UserModel(sequelize);

// Sincronizar los modelos con la base de datos (crear las tablas si no existen)
// .sync({ alter: true  }) para alterar la tabla
sequelize
  .sync({ force: false }) // force: false evita que se sobreescriban las tablas (si la tabla no existe la crea)
  .then(() => console.log("Tablas sincronizadas"))
  .catch((err) => console.error("Error al sincronizar las tablas:", err));

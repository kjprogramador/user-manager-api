import { Sequelize } from "sequelize";
import { dbConfig } from "../config/db.js";
import UserModel from "./userModel.js";

let sequelize;

// Verifica si hay una URL para la base de datos (Heroku)
if (dbConfig.url) {
  // Conectar usando la URL
  sequelize = new Sequelize(dbConfig.url, {
    dialect: dbConfig.dialect,
    protocol: dbConfig.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Esto es necesario para Heroku en muchos casos
      },
    },
  });
} else {
  // Conectar usando credenciales individuales
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
    }
  );
}

// Inicializar el modelo de Usuario
export const User = UserModel(sequelize);

// Sincronizar los modelos con la base de datos (crear las tablas si no existen)
// .sync({ alter: true  }) para alterar la tabla
sequelize
  .sync({ force: false }) // force: false evita que se sobreescriban las tablas (si la tabla no existe la crea)
  .then(() => console.log("Tablas sincronizadas"))
  .catch((err) => console.error("Error al sincronizar las tablas:", err));

export { sequelize };

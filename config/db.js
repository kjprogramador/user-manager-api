import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde .env

export const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "postgres",
};

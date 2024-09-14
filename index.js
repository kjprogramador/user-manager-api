import express from "express";
import userRoutes from "./routes/userRoutes.js";
import { sequelize } from "./models/index.js"; // Importa la conexión de Sequelize

const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Probar la conexión con la base de datos
sequelize
  .authenticate()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) =>
    console.error("Error al conectar con la base de datos:", err)
  );

// Definir las rutas
app.use("/api/v1/users", userRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

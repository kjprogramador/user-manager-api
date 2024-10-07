import request from "supertest";
import app from "../index.js"; // Asegúrate de tener el archivo principal donde defines el servidor
import { User, sequelize } from "../models";
import bcrypt from "bcryptjs";

describe("Pruebas de la API de gestión de usuarios", () => {
  let tokenAdmin;

  // Configuración antes de todas las pruebas
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Encriptar la contraseña para el admin
    const password = "password";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario admin
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    // Login como admin
    const resAdmin = await request(app).post("/api/v1/users/login").send({
      email: "admin@example.com",
      password,
    });

    tokenAdmin = resAdmin.body.token; // Guardar el token de admin para las pruebas
  });

  // Limpiar la base de datos después de cada test
  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  // Cerrar la conexión de Sequelize después de todas las pruebas
  afterAll(async () => {
    await sequelize.close();
  });

  // Prueba para crear un nuevo usuario con éxito
  it("Debe crear un nuevo usuario (admin)", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "Nuevo Usuario",
        email: "nuevo_usuario@example.com",
        password: "passwordSeguro123",
        role: "user",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Usuario creado exitosamente");
    expect(res.body.usuario).toHaveProperty("id");
    expect(res.body.usuario).toHaveProperty(
      "email",
      "nuevo_usuario@example.com"
    );
  }, 10000);

  // Prueba para intentar crear un usuario duplicado
  it("No debe permitir crear un usuario duplicado", async () => {
    // Crear el primer usuario
    await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "Nuevo Usuario",
        email: "nuevo_usuario@example.com",
        password: "passwordSeguro123",
        role: "user",
      });

    // Intentar crear el mismo usuario nuevamente
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "Nuevo Usuario",
        email: "nuevo_usuario@example.com",
        password: "passwordSeguro123",
        role: "user",
      });

    expect(res.statusCode).toEqual(400); // Código de error por duplicación
    expect(res.body).toHaveProperty("message", "El usuario ya existe");
  });

  // // Prueba para crear un usuario sin autenticación
  it("No debe permitir crear un usuario sin autenticación", async () => {
    const res = await request(app).post("/api/v1/users").send({
      name: "Usuario No Autenticado",
      email: "usuario_no_auth@example.com",
      password: "passwordSeguro123",
      role: "user",
    });

    expect(res.statusCode).toEqual(401); // Código de error por falta de autenticación
    expect(res.body).toHaveProperty(
      "message",
      "No hay token, permiso no válido"
    );
  });

  // // Prueba para manejar un email inválido
  it("No debe permitir crear un usuario con un email inválido", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "Usuario con Email Inválido",
        email: "email_invalido",
        password: "passwordSeguro123",
        role: "user",
      });

    expect(res.statusCode).toEqual(400); // Código de error por datos inválidos
    expect(res.body).toHaveProperty(
      "message",
      "Error en la validación de los datos"
    );
  });

  // Prueba para manejo de falta de datos obligatorios
  it("No debe permitir crear un usuario sin el campo de email", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "Usuario sin Email",
        password: "passwordSeguro123",
        role: "user",
      });

    expect(res.statusCode).toEqual(400); // Código de error por datos faltantes
    expect(res.body).toHaveProperty(
      "message",
      "Error en la validación de los datos"
    );
  });
});

import express from "express";
import { body } from "express-validator";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { validateToken } from "../middlewares/auth.js"; // Importas el middleware de autenticación
import { validateRole } from "../middlewares/role.js";
import { loginUser } from "../controllers/authController.js";
import { registerUser } from "../controllers/registerController.js";

const router = express.Router();

// Rutas CRUD
// Obtener todos los usuarios
router.get("/users", validateToken, validateRole("admin"), getUsers);

// Obtener un usuario por ID
router.get("/users/:id", getUserById);

// Ruta para crear usuario (POST) con validaciones
router.post(
  "/users",
  [
    body("name").trim().not().isEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Agrega un email válido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("El password debe tener al menos 6 caracteres"),
  ],
  validateToken, // Solo usuarios autenticados pueden crear usuarios
  validateRole("admin"), // Solo administradores pueden crear usuarios
  createUser
);

// Actualizar usuario
router.put(
  "/users/:id",
  [
    body("name")
      .optional()
      .trim() // Elimina espacios al inicio y al final
      .not()
      .isEmpty()
      .withMessage("El nombre no debe estar vacío"), // no funciona para vacio " " si para ""
    body("email").optional().isEmail().withMessage("Agrega un email válido"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("El password debe tener al menos 6 caracteres"),
    body("role")
      .optional()
      .isIn(["admin", "usuario"])
      .withMessage("El rol debe ser admin o usuario"),
  ],
  validateToken,
  updateUser
);

// Eliminar un usuario
router.delete("/users/:id", deleteUser);

// Ruta para login de usuario (POST /login)
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Agrega un email válido"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("El password es obligatorio"),
  ],
  loginUser
);

router.post(
  "/register",
  [
    body("name").trim().not().isEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Agrega un email válido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("El password debe tener al menos 6 caracteres"),
  ],
  registerUser
);

export default router;

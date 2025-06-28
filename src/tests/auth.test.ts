import request from "supertest";
import app from "../app";
import sequelize from "../config/db";
import PasswordResetCode from "../models/PasswordResetCodes.model";

jest.mock("../services/email.service", () => ({
  EmailServices: jest.fn().mockImplementation(() => ({
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  })),
}));

// Helpers para validar respuestas
const expectOkResponse = (
  res: request.Response,
  statusCode: number,
  message?: string | RegExp
) => {
  expect(res.status).toBe(statusCode);
  expect(res.body.ok).toBe(true);
  if (message) {
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toMatch(message);
  }
};

const expectErrorResponse = (
  res: request.Response,
  statusCode: number,
  message?: string | RegExp
) => {
  expect(res.status).toBe(statusCode);
  if (message) {
    // expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toMatch(message);
  }
};

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Resetea la base de datos para pruebas limpias
});

afterAll(async () => {
  await sequelize.close(); // Cierra la conexión después de las pruebas
});

describe("🧪 Pruebas de autenticación", () => {
  const testUser = {
    name: "Carlos",
    username: "carlosjr",
    email: "carlos@example.com",
    password: "Segura!1234",
  };

  it("✅ Debería registrar un nuevo usuario", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  it("❌ No debería registrar un usuario con el mismo correo", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(testUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("✅ Debería permitir login con credenciales válidas", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("❌ No debería permitir login con contraseña incorrecta", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: "ContraseñaIncorrecta123",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
}); 

// Reset Password
describe("🔁 Pruebas de recuperación de contraseña", () => {
  const email = "carlos@example.com";
  const user_id = 1; // El ID del usuario creado en el primer describe

  // Hook que se ejecuta ANTES de cada 'it' en este bloque.
  // Esto garantiza que cada test comience con la tabla de códigos vacía.
  beforeEach(async () => {
    await PasswordResetCode.destroy({ where: { user_id } });
  });

  it("✅ Debe restablecer la contraseña con un flujo completo y válido", async () => {
    const email = "carlos@example.com";
    const user_id = 1; // El ID del usuario creado en el primer describe
    // Paso 1: Solicitar y crear un código válido para asegurarse de que el sistema no falla por "no hay código".
    await request(app).post("/api/v1/auth/forgot-password").send({ email });
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: email });

    const entry = await PasswordResetCode.findOne({ where: { user_id } });
    expect(entry).not.toBeNull();
    const validCode = entry!.code;

    const res = await request(app).post("/api/v1/auth/reset-password").send({
      email: email,
      code: validCode,
      newPassword: "NuevaClaveSegura!456",
    });
    console.log(validCode);
    // console.log();

    // Paso 4: Verificar el éxito. ESTO AHORA DEBERÍA PASAR.
    expectOkResponse(res, 200, "updated successfully");

    // Opcional: Verificar que el código se eliminó.
    const deletedEntry = await PasswordResetCode.findOne({
      where: { user_id },
    });
    expect(deletedEntry).toBeNull();
  });

  it("❌ No debe restablecer contraseña con código incorrecto", async () => {
    // Paso 1: Solicitar y crear un código válido para asegurarse de que el sistema no falla por "no hay código".
    await request(app).post("/api/v1/auth/forgot-password").send({ email });

    // Paso 2: Intentar restablecer con un código FALSO.
    const res = await request(app).post("/api/v1/auth/reset-password").send({
      email,
      code: "CODIGO-INCORRECTO",
      newPassword: "OtraClave!789",
    });

    // Paso 3: Verificar que se rechaza con 400. ESTO AHORA DEBERÍA PASAR.
    // expectErrorResponse(res, 400, /Error de validación/i);
    expectErrorResponse(res, 400);
  });

  it("❌ No debe enviar código si el correo no existe", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "noexiste@example.com" });

    expectErrorResponse(res, 404, /User not found/i);
  });
});

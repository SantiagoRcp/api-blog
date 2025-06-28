import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { text } from "stream/consumers";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailServices {
  async sendPasswordResetEmail(to: string, name: string, code: string) {
    const dataMessage = {
      from: `"Blog API" <no-reply@blogapi.com>`,
      to,
      subject: "Código de recuperación de contraseña",
      html: `
          <p>Hola <strong>${name}</strong>,</p>
          <p>Tu código de recuperación es:</p>
          <h2 style="color:rgb(23, 85, 148);">${code}</h2>
          <p>Este código expirará en 8 minutos.</p>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `,
    };

    const info = await transporter.sendMail({ ...dataMessage });

    console.log(`correo enviado ${info}`);
  }
}

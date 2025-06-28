import { EmailServices } from "../services/email.service";

const email = new EmailServices();

export const emailTes = email
  .sendPasswordResetEmail("santiagorcp.9854@gmail.com", "Santiago", "123456779")
  .then(() => console.log("Enviado"))
  .catch(console.error);

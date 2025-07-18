# API Blog

API RESTful para la gestión de blogs, usuarios, autenticación, publicaciones, categorías, etiquetas y comentarios.

## Descripción

Este proyecto es una API desarrollada en Node.js y TypeScript que permite la administración de un blog. Incluye funcionalidades para el registro y autenticación de usuarios, creación y gestión de publicaciones, categorías, etiquetas y comentarios. Además, implementa roles de usuario (User, Author, Admin) y recuperación de contraseña por correo electrónico.

## Características

- Registro y autenticación de usuarios con JWT.
- Roles y permisos: User, Author, Admin.
- CRUD de publicaciones, categorías, etiquetas y comentarios.
- Recuperación de contraseña por email.
- Validaciones robustas con express-validator.
- Asociación entre modelos usando Sequelize.

## Estructura del Proyecto

```
src/
  app.ts
  server.ts
  config/
  controllers/
  interfaces/
  middlewares/
  models/
  routes/
  seeders/
  services/
  tests/
  utils/
  validators/
```

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env` (ver ejemplo abajo).

4. Ejecuta las migraciones si es necesario.

## Uso

### Desarrollo

```sh
npm run dev
```

### Producción

```sh
npm run build
npm start
```

### Pruebas

```sh
npm test
```

## Variables de Entorno

Ejemplo de archivo `.env`:

```
DB_NAME=nombre_base_de_datos
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=localhost
DB_PORT=3306

JWT_SECRET=tu_jwt_secreto
JWT_EXPIRES_IN=1h

EMAIL_HOST=smtp.tuemail.com
EMAIL_PORT=587
EMAIL_USER=usuario@tuemail.com
EMAIL_PASS=contraseña
```

## Endpoints Principales

- `/api/v1/auth/register` - Registro de usuario
- `/api/v1/auth/login` - Login de usuario
- `/api/v1/auth/forgot-password` - Solicitar recuperación de contraseña
- `/api/v1/auth/reset-password` - Restablecer contraseña
- `/api/v1/user/me` - Perfil de usuario autenticado
- `/api/v1/post/` - CRUD de publicaciones
- `/api/v1/categories` - Listar categorías
- `/api/v1/tag` - CRUD de etiquetas
- `/api/v1/comments/:idPost` - Comentarios de un post

## Tecnologías

- Node.js
- TypeScript
- Express
- Sequelize (MySQL)
- JWT
- Jest & Supertest
- Nodemailer

## Autor

SantiagoRcp

---

¡Contribuciones y sugerencias son bienvenidas!
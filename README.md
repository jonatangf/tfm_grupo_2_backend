# Trips API Backend

API REST para la gestión integral de viajes, usuarios y entidades auxiliares del proyecto
TripMate. Este documento describe la arquitectura, las capas y los endpoints disponibles para
que el equipo de frontend pueda consumirlos con claridad.

---

## Tecnologías principales

- **Node.js 20+**
- **Express 5**
- **MySQL** (driver `mysql2/promise`)
- **express-validator** para validaciones
- **dotenv** para configuración
- **Biome** para linting

---

## Arquitectura y estructura

```
src/
  app.js                  # Instancia de Express, middlewares y registro de rutas
  index.js                # Entrada del servidor
  config/
    db.js                 # Pool de conexiones MySQL
  controllers/            # Capa HTTP (req/res)
  models/                 # Capa de acceso a datos
  routes/                 # Definición de endpoints
  services/               # Lógica de negocio por recurso
  validations/            # Reglas de express-validator
  middlewares/
    asyncHandler.js       # Wrapper de promesas para manejo de errores
```

Cada recurso tiene controller → service → model → validation dedicados, lo que facilita mantener
reglas de negocio separadas de la capa HTTP.

| Recurso                | Controller                               | Service                                 | Model                                    | Validation                                      |
|------------------------|------------------------------------------|-----------------------------------------|------------------------------------------|--------------------------------------------------|
| Countries              | `controllers/countries.controller.js`    | `services/countries.service.js`         | `models/countries.model.js`              | `validations/countries.validation.js`            |
| Interests              | `controllers/interests.controller.js`    | `services/interests.service.js`         | `models/interests.model.js`              | `validations/interests.validation.js`            |
| Users                  | `controllers/users.controller.js`        | `services/users.service.js`             | `models/users.model.js`                  | `validations/users.validation.js`                |
| Interests ↔ Users      | —                                        | `services/users.service.js`             | `models/interestsUsers.model.js`         | —                                                |
| Accommodations         | `controllers/accommodations.controller.js`| `services/accommodations.service.js`    | `models/accommodations.model.js`         | `validations/accommodations.validation.js`       |
| Means of transports    | `controllers/means_of_transports.controller.js` | `services/means_of_transports.service.js` | `models/means_of_transports.model.js` | `validations/means_of_transports.validation.js`  |
| Trips                  | `controllers/trips.controller.js`        | `services/trips.service.js`             | `models/trips.model.js`                  | `validations/trips.validation.js`                |
| Trips members          | `controllers/trips_members.controller.js`| `services/trips_members.service.js`     | `models/trips_members.model.js`          | `validations/trips_members.validation.js`        |
| Messages               | `controllers/messages.controller.js`     | `services/messages.service.js`          | `models/messages.model.js`               | `validations/messages.validation.js`             |
| Reviews                | `controllers/reviews.controller.js`      | `services/reviews.service.js`           | `models/reviews.model.js`                | `validations/reviews.validation.js`              |

Los servicios centralizan la lógica: validan reglas de negocio, coordinan múltiples modelos (por
ejemplo, users + interests) y normalizan los mensajes de error en español.

---

## Colección Postman

Toda la documentación de endpoints se mantiene sincronizada en
`tfm-backend.postman_collection.json`. Para importarla:

1. Abrir Postman → `Import`.
2. Seleccionar el archivo `tfm-backend.postman_collection.json` (raíz del repo).
3. Usar `http://localhost:3000` como base (o ajustar según tu entorno).

La colección incluye ejemplos de cuerpos válidos y recursos agrupados exactamente como se describe
a continuación.

---

## Endpoints principales (según la colección Postman)

Base URL por defecto: `http://localhost:3000`. Todos los endpoints responden en JSON y aceptan los
parámetros de paginación `limit` y `offset` en los listados.

### Users (`/users`)
- `GET /users/` – Lista usuarios.
- `GET /users/:id` – Obtiene un usuario específico.
- `POST /users/` – Crea usuario (ver ejemplo en Postman con campos `name`, `lastname`, `email`, `password`, `interests`, etc.).
- `PATCH /users/:id` – Actualiza parcialmente.
- `DELETE /users/:id` – Eliminación dura.

### Interests (`/interests`)
- `GET /interests/` – Lista intereses (incluye usuarios asociados en responses actuales).
- `GET /interests/:id`
- `POST /interests/`
- `PATCH /interests/:id`
- `DELETE /interests/:id`

### Countries (`/countries`)
- `GET /countries/`
- `GET /countries/:id`
- `POST /countries/`
- `PATCH /countries/:id`
- `DELETE /countries/:id`

### Means of transports (`/means_of_transports`)
- `GET /means_of_transports/`
- `GET /means_of_transports/:id`
- `POST /means_of_transports/`
- `PATCH /means_of_transports/:id`
- `DELETE /means_of_transports/:id`

### Accommodations (`/accommodations`)
- `GET /accommodations/`
- `GET /accommodations/:id`
- `POST /accommodations/`
- `PATCH /accommodations/:id`
- `DELETE /accommodations/:id`

### Trips (`/trips`)
- `GET /trips/`
- `GET /trips/:id`
- `POST /trips/` – Requiere `destiny_place`, `creator_id`, `min_participants` y el resto de campos opcionales.
- `PATCH /trips/:id`
- `DELETE /trips/:id`

### Messages (`/messages`)
- `GET /messages/`
- `GET /messages/:id`
- `POST /messages/` – Cuerpo con `message`, `users_id`, `trips_id` y opcional `messages_id`.
- `PATCH /messages/:id`
- `DELETE /messages/:id`

### Trips members (`/trips_members`)
- `GET /trips_members/`
- `GET /trips_members/:id` (en la colección se referencia con un único ID; en la API real se usan `/:usersId/:tripsId`).
- `POST /trips_members/`
- `PATCH /trips_members/:id`
- `DELETE /trips_members/:id`

### Reviews (`/reviews`)
- `GET /reviews/`
- `GET /reviews/:id` (la colección usa un único ID; en la API real se identifican con `/:usersId/:tripsId/:reviewedUserId`).
- `POST /reviews/`
- `PATCH /reviews/:id`
- `DELETE /reviews/:id`

> **Nota:** Algunas rutas de la colección conservan IDs simples para facilitar pruebas rápidas,
> pero la implementación actual ya maneja claves compuestas (e.g. trips_members y reviews). Ajusta
> los parámetros según necesites.

### Ejemplos rápidos

Consulta la colección para cuerpos completos por cada request (users, trips, mensajes, etc.). Allí
encontrarás payloads listos para copiar/pegar.

---

## Instalación y configuración

```bash
npm install
cp .env.example .env   # Editar credenciales y puerto
```

Variables mínimas del `.env`:

| Variable      | Descripción                        |
|---------------|------------------------------------|
| `PORT`        | Puerto del servidor (default 3000) |
| `DB_HOST`     | Host de MySQL                      |
| `DB_PORT`     | Puerto de MySQL                    |
| `DB_USER`     | Usuario                            |
| `DB_PASSWORD` | Contraseña                         |
| `DB_NAME`     | Base de datos                      |

---

## Ejecución

```bash
npm run dev      # nodemon
# o
npm start        # node index.js
```

El servidor queda disponible en `http://localhost:<PORT>`.

---

## Buenas prácticas adoptadas

- Arquitectura en capas con responsabilidades bien definidas.
- Validaciones consistentes mediante `express-validator`.
- Manejo de errores centralizado (`asyncHandler` + middleware global).
- Mensajes y logs en español para facilitar soporte.
- Código linted con Biome.

---

## Próximos pasos sugeridos

- Añadir autenticación/autorización si se requiere restringir rutas.
- Documentar la API con Swagger u OpenAPI.
- Incorporar pruebas automatizadas (unitarias e integrales).
- Ampliar filtrados (por ejemplo `/trips?status=open` o `/reviews?reviewed_user_id=12`).

---

Para cualquier duda adicional, contactar al equipo backend. Este README se mantendrá actualizado
con los nuevos módulos/endpoints que se vayan añadiendo.

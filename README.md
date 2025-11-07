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

## Endpoints principales

- Todos devuelven JSON.
- Los listados aceptan `?limit` y `?offset` (por defecto 50 y 0).
- PUT/PATCH comparten la misma lógica de actualización.

| Recurso             | Endpoint base               | Notas                                                                                 |
|---------------------|-----------------------------|---------------------------------------------------------------------------------------|
| Countries           | `/countries`                | CRUD completo de países                                                               |
| Interests           | `/interests`                | CRUD + usuarios relacionados                                                          |
| Users               | `/users`                    | CRUD + intereses asociados (`interests: number[]`)                                    |
| Accommodations      | `/accommodations`           | CRUD de alojamientos                                                                  |
| Means of transports | `/means_of_transports`      | CRUD de medios de transporte                                                          |
| Trips               | `/trips`                    | CRUD de viajes (destinos, fechas, costos, status)                                     |
| Trips members       | `/trips_members`            | Gestiona participaciones (`/:usersId/:tripsId`)                                       |
| Messages            | `/messages`                 | Mensajería referenciando `users_id`, `trips_id` y `messages_id` (hilo)                |
| Reviews             | `/reviews`                  | CRUD de reseñas (`/:usersId/:tripsId/:reviewedUserId`)                                |

### Ejemplos

**Crear usuario con intereses**
```http
POST /users
{
  "name": "Lucía",
  "lastname": "Santos",
  "email": "lucia@example.com",
  "password": "secreto123",
  "interests": [1, 3, 5]
}
```

**Agregar participante a un viaje**
```http
POST /trips_members
{
  "users_id": 45,
  "trips_id": 7,
  "status": "pending"
}
```

**Crear review**
```http
POST /reviews
{
  "users_id": 45,
  "trips_id": 7,
  "reviewed_user_id": 12,
  "review": "Excelente guía",
  "score": 9
}
```

**Actualizar estado de participación**
```http
PATCH /trips_members/45/7
{
  "status": "accepted"
}
```

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

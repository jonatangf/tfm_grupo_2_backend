# Trips API

API REST para la gesti�n de viajes.

## Tecnologías

- **Node.js** con **Express 5**
- ES Modules (import/export)
- dotenv para variables de entorno

## Estructura del proyecto

```
trips-api/
  app.js              
  index.js            
  config/
    env.js          
```

## Instalación

```bash
npm install
```

## Configuración

El servidor utiliza las siguientes variables de entorno:

- `PORT`: Puerto en el que se ejecuta el servidor (por defecto: 3000)

Puedes crear un archivo `.env` en la raíz del proyecto para configurar estas variables.

## Ejecución

```bash
node index.js
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado).

# Trips API

API REST para la gesti�n de viajes.

## Tecnolog�as

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

## Instalaci�n

```bash
npm install
```

## Configuraci�n

El servidor utiliza las siguientes variables de entorno:

- `PORT`: Puerto en el que se ejecuta el servidor (por defecto: 3000)

Puedes crear un archivo `.env` en la ra�z del proyecto para configurar estas variables.

## Ejecuci�n

```bash
node index.js
```

El servidor se iniciar� en `http://localhost:3000` (o el puerto configurado).
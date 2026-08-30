# Chiikawa Tamagotchi

> Una experiencia web fullstack, persistente y responsive para cuidar una mascota virtual, descubrir contenido y desbloquear secretos.

Chiikawa Tamagotchi es un proyecto de portfolio que combina una interfaz emocional con una arquitectura web completa. El usuario puede cuidar a Chiikawa, consultar cómo evoluciona su estado, desbloquear cartas y logros, escuchar una playlist, cambiar de tema y descubrir easter eggs.

El foco del proyecto está en demostrar criterio de producto además de implementación: una experiencia clara en móvil, feedback inmediato, estado persistente y una separación limpia entre frontend, API y almacenamiento.

## Por qué este proyecto destaca

- **Producto con identidad:** diseño kawaii de papelería digital, con sistema visual consistente y microinteracciones.
- **UX orientada a hábitos:** rachas, degradación temporal de estadísticas, recompensas y contenido desbloqueable.
- **Fullstack real:** frontend en Next.js y TypeScript, API REST en Express y persistencia en SQLite.
- **Arquitectura desplegable:** servicios aislados con Docker Compose y Nginx como reverse proxy.
- **Responsive by design:** navegación inferior en móvil, navegación lateral en desktop y targets táctiles accesibles.
- **Estado y reglas de negocio:** acciones del usuario, progreso, temas, logros y secretos se validan y persisten desde el backend.

## Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express 4, REST API |
| Datos | SQLite, `sqlite3` |
| Infraestructura | Docker, Docker Compose, Nginx |
| Experiencia | CSS animations, temas dinámicos, responsive navigation |

## Arquitectura

```text
Cliente
  |
  v
Nginx :80
  |----------------------|
  v                      v
Next.js :3000       Express :5000
                         |
                         v
                    SQLite
```

El proxy centraliza el acceso público, mientras que frontend y backend se ejecutan como servicios independientes. La base de datos se monta como volumen de Docker para conservar el progreso al reiniciar el contenedor.

## Funcionalidades

### Mascota virtual

- Estados de felicidad, hambre y sueño.
- Acciones de comida, mimos, juego y descanso.
- Degradación de estadísticas según el tiempo transcurrido.
- Sprites pixel art que reflejan el estado actual.
- Diálogo contextual y feedback visual después de cada acción.

### Progreso y contenido

- Cartas desbloqueables mediante visitas, rachas y logros.
- 13 logros agrupados por cuidado, exploración, dedicación y secretos.
- Galería de sprites, fondos y stickers.
- Playlist integrada con enlaces a Spotify y mensajes personalizados.
- Temas estacionales: default, Sakura, invierno, Halloween y Navidad.

### Exploración

- Konami Code y palabra secreta.
- Easter egg de hora mágica.
- Recompensa por repetir mimos rápidamente.
- Zona secreta con requisitos acumulativos de progreso.

## API

### Health check

```http
GET /health
```

### Tamagotchi

```http
GET  /tamagotchi/status
POST /tamagotchi/action
```

### Progreso

```http
GET  /progress/streak
GET  /progress/secret
POST /progress/letters/unlock
POST /progress/songs/view
POST /progress/achievements/unlock
POST /progress/easter-eggs/find
POST /progress/theme
POST /progress/secret/unlock
```

## Ejecución con Docker

### Requisitos

- Docker Desktop
- Docker Compose

### Levantar el proyecto

```bash
docker compose up --build
```

La aplicación quedará disponible en `http://localhost`.

### Detener servicios

```bash
docker compose down
```

## Desarrollo sin Docker

Instalar dependencias en cada aplicación:

```bash
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend usa `/api` como base pública cuando se ejecuta detrás de Nginx. Para desarrollo directo, configura `NEXT_PUBLIC_API_URL` según la URL del backend.

## Estructura

```text
.
├── backend/
│   ├── controllers/       # Reglas de negocio y respuestas HTTP
│   ├── database/          # Esquema y conexión SQLite
│   ├── routes/            # Endpoints REST
│   └── server.js          # Bootstrap de Express
├── frontend/
│   ├── public/             # Sprites, fondos y recursos visuales
│   └── src/
│       ├── components/    # UI reutilizable y layout
│       ├── hooks/         # Estado, temas, notificaciones y easter eggs
│       ├── pages/         # Rutas de la aplicación
│       ├── styles/        # Tokens y estilos globales
│       └── utils/         # Cliente API y datos del juego
├── nginx/                  # Reverse proxy y configuración de producción
├── docker-compose.yml
└── README.md
```

## Decisiones técnicas

- **Next.js Pages Router:** navegación simple y estable para una aplicación pequeña con varias vistas.
- **Hooks especializados:** encapsulan estado de juego, temas, notificaciones y detección de secretos sin acoplar la UI a la API.
- **SQLite:** solución ligera y suficiente para un producto personal, con persistencia local y cero infraestructura externa.
- **Docker Compose:** permite reproducir el entorno completo con un único comando.
- **Nginx:** separa el tráfico público del frontend y la API, y deja preparada la aplicación para un despliegue detrás de Cloudflare Tunnel.

## Personalización

El contenido del juego se centraliza en `frontend/src/utils/gameData.ts`. Desde ahí se pueden modificar cartas, canciones, logros, temas y condiciones de desbloqueo sin tocar los componentes de presentación.

## Despliegue

Para exponer la aplicación de forma segura:

1. Ejecutar `docker compose up -d` en el servidor.
2. Configurar Cloudflare Tunnel apuntando a `http://localhost:80`.
3. Mantener el backend sin exposición pública directa y dejar que Nginx gestione el tráfico.

## Autor

Proyecto desarrollado como muestra de ingeniería fullstack: diseño de producto, frontend responsive, API REST, persistencia, containerización y despliegue.

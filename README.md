# 🌸 Chiikawa Tamagotchi — Para Lucy

Una página web personalizada con estética kawaii/coquette donde puedes cuidar un Chiikawa mientras descubres canciones, cartas y secretos.

## 🏗️ Arquitectura

```
Internet → Cloudflare Tunnel → Nginx (puerto 80) → Frontend (Next.js :3000) / Backend (Express :5000)
```

### Contenedores Docker
| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **nginx** | 80 | Proxy reverso, cache de assets, gzip |
| **frontend** | 3000 | Next.js + TypeScript + Tailwind CSS v4 |
| **backend** | 5000 | Express + SQLite |

## 🚀 Setup Local

### Requisitos
- Docker y Docker Compose instalados

### Ejecución
```bash
# Construir y levantar todos los contenedores
docker-compose up --build

# La web estará disponible en http://localhost
```

### Desarrollo (sin Docker)
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
chiikawa-lucy/
├── docker-compose.yml
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   ├── images/          # Sprites del personaje (pixel art)
│   │   ├── backgrounds/     # Fondos temáticos
│   │   ├── stickers/        # Stickers kawaii
│   │   └── icons/           # Iconos de navegación
│   └── src/
│       ├── pages/           # Páginas (Home, Tamagotchi, Cartas, Música, Logros, Galería, Secreto)
│       ├── components/      # Componentes reutilizables
│       ├── hooks/           # Hooks personalizados (estado, easter eggs, temas, notificaciones)
│       ├── utils/           # API client, datos del juego
│       └── styles/          # CSS global con Tailwind v4
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── routes/              # Rutas de API
│   ├── controllers/         # Lógica de negocio
│   └── database/
│       ├── db.js            # Conexión SQLite
│       ├── schema.sql       # Esquema de la BD
│       └── sqlite.db        # Base de datos
└── README.md
```

## 🎮 Funcionalidades

### 🐹 Tamagotchi
- 3 estadísticas: ❤️ Felicidad, 🍓 Hambre, 😴 Sueño
- 4 acciones: Comida, Mimos, Jugar, Dormir
- Degradación de stats por tiempo sin visitar
- Animaciones pixel art por estado

### 💌 Cartas
- 3 cartas desbloqueables + 1 carta secreta
- Desbloqueo por: visitas, días consecutivos, logros
- Tipografía manuscrita estilizada

### 🎵 Música
- 8 canciones de la playlist "CHIIKAWA SONGS:3"
- Enlaces directos a Spotify
- Mensajes personalizados por canción

### 🏆 Logros
- 13 logros desbloqueables
- Categorías: cuidado, exploración, persistencia
- Verificación automática de condiciones

### 📸 Galería
- Stickers pixel art
- Sprites del personaje
- Fondos temáticos

### 🥚 Easter Eggs
- Konami Code (↑↑↓↓←→←→BA)
- Palabra secreta ("chiikawa")
- Hora mágica (3:33 AM)
- Triple Mimos (3 mimos en 5 segundos)
- Y más...

### 🔒 Zona Secreta
Requisitos: 5+ logros, 3+ easter eggs, 7+ días consecutivos, todas las cartas

### 🌸 Temas
- Default (rosa pastel)
- Sakura (primavera)
- Invierno (nieve)
- Halloween (calabazas kawaii)
- Navidad (luces festivas)

## ✏️ Personalización

### Editar Cartas
Las cartas están en `frontend/src/utils/gameData.ts` en el array `LETTERS`. Cada carta tiene:
- `title`: Título de la carta
- `content`: Texto del mensaje
- `unlockCondition`: Descripción de cómo se desbloquea

### Editar Canciones
Las canciones están en `frontend/src/utils/gameData.ts` en el array `SONGS`. Cada canción tiene:
- `name`, `artist`: Datos de la canción
- `spotifyUrl`: Enlace de Spotify
- `message`: Mensaje personalizado

## 🌐 Deploy con Cloudflare Tunnel

1. Levantar Docker: `docker-compose up -d`
2. Configurar Cloudflare Tunnel apuntando a `http://localhost:80`
3. El tunnel enrutará el tráfico a Nginx que distribuye entre frontend y backend

## 💕 Hecho con amor 🌸

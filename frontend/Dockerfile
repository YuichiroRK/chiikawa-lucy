FROM node:20-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar primero los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Construir la aplicación Next.js para producción
RUN npm run build

# Exponer el puerto que usará Next.js (el cual Nginx leerá en la red interna)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

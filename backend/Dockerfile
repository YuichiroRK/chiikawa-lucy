FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos sqlite3 dependencias del sistema por si acaso
RUN apk add --no-cache python3 make g++ 
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]

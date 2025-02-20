FROM node:18

WORKDIR /app

# Copiar los archivos de package.json y package-lock.json primero
COPY Backend/package.json Backend/package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar los archivos de Prisma antes de ejecutar prisma generate
COPY Backend/prisma /app/prisma

# Ejecutar prisma generate
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Copiar el resto de los archivos del backend
COPY ./Backend /app

EXPOSE 3000

CMD ["npm", "run", "dev"]

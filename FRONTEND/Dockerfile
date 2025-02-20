FROM node:18

WORKDIR /app

# Copia el package.json, package-lock.json y la carpeta prisma primero
COPY Backend/package.json Backend/package-lock.json ./
COPY Backend/prisma ./prisma

# Instala las dependencias
RUN npm install

# Genera el cliente de Prisma, ahora ya puede encontrar el schema
RUN npx prisma generate --schema=./prisma/schema.prisma

# Instala nodemon de forma global (opcional, si lo necesitas global)
RUN npm install -g nodemon

# Copia el resto de la aplicación
COPY ./Backend ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
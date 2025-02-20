FROM node:18

WORKDIR /app

COPY Backend/package.json Backend/package-lock.json ./


RUN npm install

RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm install -g nodemon

COPY ./Backend ./ 

EXPOSE 3000

CMD ["npm", "run", "dev"]

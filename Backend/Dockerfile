FROM node:18

WORKDIR /app

COPY ./Backend/package.json ./Backend/package-lock.json ./

RUN npm install


COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

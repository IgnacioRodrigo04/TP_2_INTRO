FROM node:18

WORKDIR /app

COPY FRONTEND/package.json FRONTEND/package-lock.json ./

RUN npm install

COPY ./FRONTEND ./

EXPOSE 8000

CMD ["npm", "start"]

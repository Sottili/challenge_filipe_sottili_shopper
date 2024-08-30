FROM node:latest

RUN mkdir app

WORKDIR ./app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 80

CMD ["npm", "run", "start:dev"]

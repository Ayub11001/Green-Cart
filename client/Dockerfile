FROM node:22-alpine

RUN npm install -g npm@latest

WORKDIR /app

COPY package*.json .

RUN npm ci 

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

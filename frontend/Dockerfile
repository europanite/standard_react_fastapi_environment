FROM node:24-bullseye

WORKDIR /app

COPY app/package*.json ./
RUN npm ci

CMD ["npm", "start"]

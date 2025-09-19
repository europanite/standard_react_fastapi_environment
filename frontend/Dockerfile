FROM node:20-bullseye

WORKDIR /app

COPY app/package*.json ./
RUN npm ci --omit=dev

CMD ["npm", "start"]

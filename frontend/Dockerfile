FROM node:20-bullseye

WORKDIR /app

COPY app/ .

RUN npm ci --omit=dev

RUN npm run build
CMD ["npm", "start"]

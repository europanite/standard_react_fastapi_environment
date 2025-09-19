FROM node:20-bullseye AS frontend-base

WORKDIR /app

# Expo CLI
RUN npm install -g expo-cli

COPY app/ /app/

# ===== jest =====
FROM frontend-base AS frontend-test

WORKDIR /app

ENV CI=true npm_config_audit=false npm_config_fund=false npm_config_progress=false HUSKY=0

COPY app/package.json app/package-lock.json ./
COPY app/ /app/
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

CMD ["npm", "test", "--silent"]
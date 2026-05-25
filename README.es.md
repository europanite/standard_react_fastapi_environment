---
layout: page
title: "🇪🇸 Español"
permalink: /es/
lang: es
---

# [Standard React FastAPI Environment](https://github.com/europanite/standard_react_fastapi_environment "Expo React Native + FastAPI Backend Starter")

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![OS](https://img.shields.io/badge/OS-Linux%20%7C%20macOS%20%7C%20Windows-blue)
[![Python](https://img.shields.io/badge/python-3.10%20|%203.11|%203.12|%203.13-blue)](https://www.python.org/)

[![CI](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/ci.yml/badge.svg)](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/ci.yml)
[![Python Lint](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/lint.yml/badge.svg)](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/lint.yml)
[![pages-build-deployment](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/pages/pages-build-deployment)
[![CodeQL Advanced](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/codeql.yml/badge.svg)](https://github.com/europanite/standard_react_fastapi_environment/actions/workflows/codeql.yml)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Pytest](https://img.shields.io/badge/pytest-%23ffffff.svg?style=for-the-badge&logo=pytest&logoColor=2f9fe3)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)


<p align="right">
  <a href="https://europanite.github.io/standard_react_fastapi_environment/">🇺🇸 English</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/hi/">🇮🇳 हिंदी</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/ja/">🇯🇵 日本語</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/zh-CN/">🇨🇳 简体中文</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/es/">🇪🇸 Español</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/pt-BR/">🇧🇷 Português (Brasil)</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/ko/">🇰🇷 한국어</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/de/">🇩🇪 Deutsch</a> |
  <a href="https://europanite.github.io/standard_react_fastapi_environment/fr/">🇫🇷 Français</a>
</p>

<img src="./assets/images/mobile_ui.png" alt="Expo mobile screenshot" width="320" />

!["web_ui"](./assets/images/web_ui.png)

Un full-stack starter container listo para ejecutar, diseñado para conectar una app Expo React Native con un backend FastAPI.

Este template incluye un frontend Expo React Native, un backend FastAPI, PostgreSQL, JWT authentication, CRUD APIs, Docker Compose, backend tests, frontend tests y GitHub Actions CI.

Usa este repository cuando quieras crear una mobile app o web app con Expo y conectarla a un backend FastAPI.

**full-stack development environment** que utiliza:

- **Frontend**: [Expo](https://expo.dev/) ([React Native](https://reactnative.dev/) + [TypeScript](https://www.typescriptlang.org/))  
  - Se ejecuta en **Web, Android e iOS** con una sola codebase
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)  
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Container**: [Docker Compose](https://docs.docker.com/compose/) para un development setup consistente

---

## Features

- **Cross-platform frontend** con Expo  
  - Se ejecuta como **web app** o en **Android/iOS devices** mediante Expo Go o standalone builds
- **CRUD operations** : crear, leer, actualizar y eliminar records
- **Auth operations** : Signup, Signin, Signout
- **FastAPI backend** con automatic docs
  - Versioned REST API bajo `/api/v1` con Swagger UI (`/docs`)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Docker Compose](https://docs.docker.com/compose/)
- [Expo Go](https://expo.dev/go) (para Android/iOS testing)

### 2. Build y start de todos los services:
```bash
# set environment variables:
export REACT_NATIVE_PACKAGER_HOSTNAME=${YOUR_HOST}

# Build the image
docker compose build

# Run the container
docker compose up
```
---

### 3. Test:

```bash
# Backend pytest
docker compose \
  -f docker-compose.test.yml run \
  --rm \
  --entrypoint /bin/sh backend_test \
  -lc ' pytest -q '

# Backend Lint
docker compose \
  -f docker-compose.test.yml run \
  --rm \
  --entrypoint /bin/sh backend_test \
  -lc 'ruff check /app /tests'

# Frontend Test
docker compose \
  -f docker-compose.test.yml run \
  --rm frontend_test
```

---

### 4. Visita los services:

- Backend API: http://localhost:8000/docs
!["backend"](./assets/images/backend.png)

- Frontend UI (WEB): http://localhost:8081
- Frontend UI (mobile): exp://${YOUR_HOST}:8081: accede con el QR proporcionado por Expo.
!["expo"](./assets/images/expo.png)

---

# License
- Apache License 2.0
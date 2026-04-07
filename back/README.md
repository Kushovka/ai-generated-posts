# AI Letter Backend

FastAPI backend for user registration/login and AI cover letter generation.

## What the app needs

- Python 3.13 for local запуск without Docker
- Docker and Docker Compose for containerized startup
- PostgreSQL 16
- Ollama with the model from `OLLAMA_MODEL`

## Quick start with Docker

1. Create env file:

```bash
cp .env.example .env
```

2. Start containers:

```bash
docker compose up --build -d
```

3. Download the model into the Ollama container:

```bash
docker-compose exec ollama ollama pull llama3.1:latest
```

4. Run migrations:

```bash
docker-compose exec app alembic upgrade head
```

5. Open the API docs:

- `http://localhost:8000/docs`

## Local start without Docker

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy env file and adjust DB host for local run:

```bash
cp .env.example .env
```

Set `POSTGRES_HOST=localhost` in `.env`.

4. Start PostgreSQL and create the database from `.env`.
5. Run migrations:

```bash
alembic upgrade head
```

6. Start the app:

```bash
uvicorn app.main:app --reload
```

## Required environment variables

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DB`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`

## Important notes

- The `/ai/*` routes require a bearer token from `/users/login`.
- The app stores generated cover letters in PostgreSQL.
- In Docker mode, the app reaches Ollama at `http://ollama:11434`.
- On a server, keep PostgreSQL and the app in private networking and expose only the API through a reverse proxy such as Nginx.

## Minimal deployment checklist

1. Copy the project to the server.
2. Install Docker and Docker Compose.
3. Create `.env` with production secrets.
4. Start the `ollama` container and pull the required model into it.
5. Run:

```bash
docker-compose up --build -d
docker-compose exec ollama ollama pull llama3.1:latest
docker-compose exec app alembic upgrade head
```

6. Put Nginx or another reverse proxy in front of `:8000`.
7. Enable HTTPS and backups for the PostgreSQL volume.

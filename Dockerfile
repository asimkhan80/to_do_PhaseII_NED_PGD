# Dockerfile for Hugging Face Spaces
# Full-stack Todo App: Next.js + FastAPI

FROM node:20-slim

WORKDIR /app

# Install Python, nginx and supervisor
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/* \
    && ln -s /usr/bin/python3 /usr/bin/python

# Copy and build frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

COPY frontend/ ./

ENV NEXT_PUBLIC_API_URL=""
RUN npm run build

# Install Python backend dependencies
WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip3 install --no-cache-dir --break-system-packages -r backend/requirements.txt pydantic-settings

COPY backend/ ./backend/

# Copy config files
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create data directory for SQLite
RUN mkdir -p /app/data

# Set environment variables
ENV DATABASE_URL="sqlite:////app/data/todo.db"
ENV CORS_ORIGINS="*"
ENV DEBUG="false"
ENV NODE_ENV="production"
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose port 7860 (HF Spaces default)
EXPOSE 7860

# Copy and setup startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]

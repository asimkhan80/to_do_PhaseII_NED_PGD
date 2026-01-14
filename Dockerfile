# Multi-stage Dockerfile for Hugging Face Spaces
# Runs Next.js frontend + FastAPI backend

# Stage 1: Build Next.js frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY frontend/ ./

# Set API URL to same origin (will be proxied)
ENV NEXT_PUBLIC_API_URL=""

# Build Next.js in standalone mode
RUN npm run build

# Stage 2: Final image with Python + Node runtime
FROM python:3.11-slim

WORKDIR /app

# Install Node.js and nginx
RUN apt-get update && apt-get install -y \
    curl \
    nginx \
    supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy Python backend
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
RUN pip install --no-cache-dir pydantic-settings

COPY backend/ ./backend/

# Copy built frontend from builder stage (standalone output)
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor config
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

# Create startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Run the startup script
CMD ["/app/start.sh"]

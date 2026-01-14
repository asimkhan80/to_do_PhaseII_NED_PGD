#!/bin/bash
set -e

echo "🚀 Starting Todo Application..."

# Create data directory if not exists
mkdir -p /app/data

# Initialize the database
echo "📦 Initializing database..."
cd /app/backend
python -c "
from app.database import create_db_and_tables, seed_default_categories
print('Creating tables...')
create_db_and_tables()
print('Seeding default categories...')
seed_default_categories()
print('Database initialized!')
"

# Start all services with supervisor
echo "🎯 Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf

#!/bin/bash
set -e

echo "🚀 Starting Standard Deployment..."

# 1. Enter Maintenance Mode
php artisan down --refresh=15 || echo "Application is already down"

# 2. Update Code (PROD SAFE)
echo "📥 Syncing code from Git (force)..."
git fetch origin main
git reset --hard origin/main
git clean -d -f -e storage/

# 3. Optimize Dependencies
echo "📦 Updating composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# 4. Handle Migrations
echo "🗄️  Running central migrations..."
php artisan migrate --force


# 5. Clear Redis
echo "🧹 Clearing Redis cache..."
redis-cli flushall
php artisan cache:forget spatie.permission.cache
echo "Redis cache cleared."

# 6. Clear Old State
echo "🧹 Clearing old application state..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 7. Build Frontend & Regenerate Routes
echo "🎨 Preparing frontend assets..."
npm ci

echo "📍 Generating frontend route manifest..."
php artisan wayfinder:generate

echo "🧹 Cleaning old build assets..."
rm -rf public/build

echo "🏗️ Building frontend assets..."
npm run build

# 8. Refresh & Optimize Caches
echo "⚡ Warming up main caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 9. Restart Background Services
echo "🔄 Restarting queue workers..."
php artisan queue:restart

# 10. Bring Application Online
php artisan up

# 11. Health Check
echo "🔍 Performing health check..."
curl -s -I http://localhost | grep "HTTP/1.1 200 OK" || echo "⚠️ Warning: Health check failed (non-200 response)"

echo "✅ Deployment complete. Application is live at aderfiasmart.com"

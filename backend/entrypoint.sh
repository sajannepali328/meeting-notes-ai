#!/bin/sh

# Exit immediately if any command fails
set -e

echo "Making migrations for main app..."
python manage.py makemigrations main

echo "Making any other remaining migrations..."
python manage.py makemigrations

echo "Applying database migrations..."
python manage.py migrate

echo "Checking for default superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='test').exists():
    User.objects.create_superuser('test', 'test@example.com', 'nepal@123');
    print('Default superuser \"test\" created successfully.');
else:
    print('Default superuser already exists.');
"

echo "Starting server..."
exec "$@"
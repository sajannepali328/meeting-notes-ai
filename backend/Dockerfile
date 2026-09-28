# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies if needed (e.g., for PostgreSQL/MySQL drivers)
RUN apt-get update && apt-get install -y gcc libpq-dev

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project code into the container
COPY . /app/

# Granthign permission
RUN chmod +x ./entrypoint.sh

# Expose the port Django runs on
EXPOSE 8000

# Set entrypoint to run the script first
ENTRYPOINT ["./entrypoint.sh"]

# Run the development server (binds to all network interfaces so Docker can reach it)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
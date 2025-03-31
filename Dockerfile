# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install system dependencies for pandas and other Python packages with native extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libssl-dev libffi-dev libblas-dev liblapack-dev libatlas-base-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install dependencies in one step
RUN pip install --upgrade pip \
    && pip cache purge \
    && pip install --no-cache-dir -r requirements.txt

# Expose port 5357 for the application
EXPOSE 5357

# Run the FastAPI app with uvicorn when the container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5357", "--workers", "10"]

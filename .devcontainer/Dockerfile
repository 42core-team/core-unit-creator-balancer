# Start from a Python image.
FROM python:latest

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Check that Python and Node.js were installed
RUN python3 --version
RUN node --version

# Copy the current directory contents into the container at /app
COPY . . 

# Install pip and any needed packages specified in requirements.txt
RUN apt-get update && apt-get install -y python3-pip && \
    pip3 install --no-cache-dir -r requirements.txt

RUN npm uninstall react react-dom
RUN npm install react@17.0.2 react-dom@17.0.2

RUN npm install @mui/material@next --legacy-peer-deps

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.py when the container launches
CMD ["bash", "npm install"]
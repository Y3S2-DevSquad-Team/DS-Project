# Use Node.js 18 as base image
FROM node:18

# Create working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port (matches your server.js port)
EXPOSE 5002

# Start the service
CMD ["node", "src/server.js"]

# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose app port
EXPOSE 4000

# Start the service
CMD ["npm", "start"]

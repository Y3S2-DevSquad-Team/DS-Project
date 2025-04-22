# Use Node 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /cart-service/backend

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the code
COPY . .

# Expose the port (make sure it matches the port your backend uses, e.g., 8000)
EXPOSE 5001

# Start the server
CMD ["npm", "start"]
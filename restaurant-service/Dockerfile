FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 5001

CMD ["npm", "start"]
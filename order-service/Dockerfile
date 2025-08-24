# Use official Node.js image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json separately for Docker cache efficiency
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Start the app
CMD ["node", "index.js"]
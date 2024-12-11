# Start with the Node.js base image
FROM node:22.12.0

# Set the working directory inside the container
WORKDIR /server

# Copy the package.json and package-lock.json files into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server directory into the container
COPY . .

# Expose the backend's port
EXPOSE 8080

# Start the backend server
CMD ["npm", "start"]

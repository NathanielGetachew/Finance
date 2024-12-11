# Use the official Node.js image
FROM node:22.12.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Install a simple static server to serve the built app
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Serve the React app
CMD ["serve", "-s", "build"]

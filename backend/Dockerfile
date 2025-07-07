# Use Node.js LTS version as the base image with multi-architecture support
FROM --platform=$TARGETPLATFORM node:18-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with npm install instead of npm ci for more flexibility
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Remove node_modules before copying the rest to avoid potential conflicts
RUN rm -rf node_modules

# Install production dependencies only
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 8081

# Command to run the application
CMD ["npm", "start"]

# Use Node.js LTS version as the base image with multi-architecture support
FROM --platform=$TARGETPLATFORM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies required for bcrypt and other native modules
RUN apk add --no-cache make gcc g++ python3 git

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and rebuild bcrypt with explicit architecture support
RUN npm ci && npm rebuild bcrypt --build-from-source

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 8081

# Command to run the application
CMD ["npm", "start"]

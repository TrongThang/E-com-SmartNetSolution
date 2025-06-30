# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy all configuration files first
COPY jsconfig.json craco.config.js tailwind.config.js postcss.config.js ./

# Copy the rest of the application
COPY . .

# Set NODE_PATH to include src directory for aliases
ENV NODE_PATH=./src
ENV INLINE_RUNTIME_CHUNK=false
ENV CI=false

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Create a directory for cache
RUN mkdir -p /var/cache/nginx/client_temp

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

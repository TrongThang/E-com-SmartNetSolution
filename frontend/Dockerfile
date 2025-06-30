# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy peer deps and ignore scripts
RUN npm ci --legacy-peer-deps --ignore-scripts || npm install --legacy-peer-deps --ignore-scripts

# Copy configuration files needed for build
COPY jsconfig.json craco.config.js tailwind.config.js postcss.config.js ./

# Copy the rest of the application
COPY . .

# Set environment variables for build
ENV NODE_PATH=./src
ENV INLINE_RUNTIME_CHUNK=false
ENV CI=false
ENV NODE_OPTIONS=--no-deprecation

# Set explicit paths for correct resolution
ENV REACT_APP_RESOLVE_MODULES=src
ENV REACT_APP_BABEL_MODULE_RESOLVER={"root":["./src"],"alias":{"@":"./src"}}

# Build the application with extended timeout
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

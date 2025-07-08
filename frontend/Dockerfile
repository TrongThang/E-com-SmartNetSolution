# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Cài đặt build tools cần thiết cho node-gyp (nếu có native module)
RUN apk add --no-cache python3 make g++

# Copy package.json và lock file trước để cache layer npm install
COPY package*.json ./

# Cài dependencies
RUN npm ci --legacy-peer-deps --ignore-scripts || npm install --legacy-peer-deps --ignore-scripts

# Copy các file cấu hình cần thiết cho build
COPY jsconfig.json craco.config.js tailwind.config.js postcss.config.js ./

# Copy toàn bộ source code
COPY . .

# Build app với biến môi trường production
ENV NODE_ENV=production
RUN npm run build
RUN ls -la  # Kiểm tra thư mục build được tạo chưa

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy build output from the build stage
COPY --from=build /app/build ./build

# Install 'serve' globally to run the static files
RUN npm install -g serve

# Expose port 80, which is the port the container will listen on
EXPOSE 80

# Command to run the app using 'serve'. It serves files from the 'build' directory on port 80.
CMD ["serve", "-s", "build", "-l", "80"]
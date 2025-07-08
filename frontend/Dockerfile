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

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy build output
COPY --from=build /app/build ./build

# Cài dependencies production (nếu cần)
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps --ignore-scripts

# Chạy ứng dụng (thay 'start' bằng script trong package.json của bạn nếu khác)
CMD ["npm", "start"]
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
FROM nginx:stable-alpine AS production

# Copy build output sang nginx
COPY --from=build /app/build /usr/share/nginx/html

# Nếu bạn có file nginx.conf thì giữ lại dòng này, nếu không thì comment lại
# COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
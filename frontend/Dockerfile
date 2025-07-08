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

# Declare build arguments that will be passed from Railway's environment variables
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_APP_ID
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_MEASUREMENT_ID
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_VAPID_KEY
ARG REACT_APP_SMART_NET_ECOMERCE_API_URL
ARG REACT_APP_SMART_NET_IOT_API_URL

# Set environment variables for the build process from the build arguments
ENV REACT_APP_FIREBASE_API_KEY=$REACT_APP_FIREBASE_API_KEY
ENV REACT_APP_FIREBASE_APP_ID=$REACT_APP_FIREBASE_APP_ID
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=$REACT_APP_FIREBASE_AUTH_DOMAIN
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=$REACT_APP_FIREBASE_MEASUREMENT_ID
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ENV REACT_APP_FIREBASE_PROJECT_ID=$REACT_APP_FIREBASE_PROJECT_ID
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=$REACT_APP_FIREBASE_STORAGE_BUCKET
ENV REACT_APP_FIREBASE_VAPID_KEY=$REACT_APP_FIREBASE_VAPID_KEY
ENV REACT_APP_SMART_NET_ECOMERCE_API_URL=$REACT_APP_SMART_NET_ECOMERCE_API_URL
ENV REACT_APP_SMART_NET_IOT_API_URL=$REACT_APP_SMART_NET_IOT_API_URL

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
# Build stage for React app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY hnrobert-homepage/package*.json ./
RUN npm ci

# Copy source code
COPY hnrobert-homepage/ ./

# Build the application
RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copy built static files to nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Install required packages
RUN apk update && \
    apk add --no-cache openssl && \
    rm -rf /var/cache/apk/*

# Create additional required directories
RUN mkdir -p /root/.config/ssl

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose necessary ports
EXPOSE 9970 9977

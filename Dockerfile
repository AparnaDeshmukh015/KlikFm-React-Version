# ============================
# 1. Build Stage (React build)
# ============================
FROM node:22-alpine AS builder

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files (excluding .dockerignore paths)
COPY . .

# Set environment file (optional)
# If you use different .env files per environment:
COPY .env.dev .env

# Build your React app
RUN npm run build:dev


# ============================
# 2. Serve Stage (Nginx web server)
# ============================
FROM nginx:1.27-alpine

# Remove default config
RUN rm -rf /etc/nginx/conf.d/*

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build output to Nginx html root
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expose port 80 (HTTP)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

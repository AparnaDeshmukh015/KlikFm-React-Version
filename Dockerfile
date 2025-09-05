# ============================
# 1. Build Stage (React build)
# ============================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy all project files (except those in .dockerignore)
COPY . .

# Copy .env.dev and rename to .env (React picks up at build time)
# Make sure .env.dev is not excluded in .dockerignore
COPY .env.dev .env

# Build React app
RUN npm run build:dev

# ============================
# 2. Nginx Stage (Serve React)
# ============================
FROM nginx:1.27-alpine

# Remove default nginx configs
RUN rm -rf /etc/nginx/conf.d/*

# Copy our custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from React to Nginx html folder
COPY --from=builder /usr/src/app/build /usr/share/nginx/html/klikfmdev

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Modify the Vite config to place files correctly
RUN rm vite.config.js && \
    echo 'import { defineConfig } from "vite";' > vite.config.js && \
    echo 'import { resolve } from "path";' >> vite.config.js && \
    echo 'export default defineConfig({' >> vite.config.js && \
    echo '  build: {' >> vite.config.js && \
    echo '    outDir: "../dist",' >> vite.config.js && \
    echo '    rollupOptions: {' >> vite.config.js && \
    echo '      input: ["src/pages/index.html"]' >> vite.config.js && \
    echo '    }' >> vite.config.js && \
    echo '  },' >> vite.config.js && \
    echo '  root: "src"' >> vite.config.js && \
    echo '});' >> vite.config.js

# Build the project
RUN npm run build -- --emptyOutDir

# Production stage
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy HTML files to root level (not in pages subdirectory)
COPY --from=build /app/dist/pages/*.html /usr/share/nginx/html/

# Copy assets directory
COPY --from=build /app/dist/assets/ /usr/share/nginx/html/assets/
COPY --from=build /app/src/assets/ /usr/share/nginx/html/assets/

# Create proper nginx config that uses index.html at root level
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri.html $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Debug: List contents of final directory
RUN ls -la /usr/share/nginx/html/
RUN cat /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

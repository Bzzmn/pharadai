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

# Modify the Vite config to process ALL HTML files and place them in the root directory
RUN rm vite.config.js && \
    echo 'import { defineConfig } from "vite";' > vite.config.js && \
    echo 'import { resolve } from "path";' >> vite.config.js && \
    echo 'import fs from "fs";' >> vite.config.js && \
    echo 'const htmlFiles = fs.readdirSync("src/pages").filter(file => file.endsWith(".html"));' >> vite.config.js && \
    echo 'const inputObj = {};' >> vite.config.js && \
    echo 'htmlFiles.forEach(file => {' >> vite.config.js && \
    echo '  const name = file.replace(".html", "");' >> vite.config.js && \
    echo '  inputObj[name] = resolve(__dirname, `src/pages/${file}`);' >> vite.config.js && \
    echo '});' >> vite.config.js && \
    echo 'export default defineConfig({' >> vite.config.js && \
    echo '  build: {' >> vite.config.js && \
    echo '    outDir: "../dist",' >> vite.config.js && \
    echo '    rollupOptions: {' >> vite.config.js && \
    echo '      input: inputObj,' >> vite.config.js && \
    echo '      output: {' >> vite.config.js && \
    echo '        // Make sure HTML files are directly in the root folder' >> vite.config.js && \
    echo '        entryFileNames: "assets/[name]-[hash].js",' >> vite.config.js && \
    echo '        chunkFileNames: "assets/[name]-[hash].js",' >> vite.config.js && \
    echo '        assetFileNames: "assets/[name]-[hash].[ext]"' >> vite.config.js && \
    echo '      }' >> vite.config.js && \
    echo '    }' >> vite.config.js && \
    echo '  },' >> vite.config.js && \
    echo '  root: "src"' >> vite.config.js && \
    echo '});' >> vite.config.js

# Debug the vite.config.js
RUN cat vite.config.js

# Build the project
RUN npm run build -- --emptyOutDir

# Enhanced debugging for the build output
RUN echo "=== HTML files in dist ===" && \
    find dist -type f -name "*.html" | sort && \
    echo "=== Directory structure ===" && \
    find dist -type d | sort && \
    echo "=== Files count ===" && \
    find dist -type f | wc -l

# Production stage
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy ALL built files (maintain the structure that Vite creates)
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Critical fix: Copy all HTML files to the root directory 
RUN echo "Moving HTML files to root directory" && \
    cp /usr/share/nginx/html/pages/*.html /usr/share/nginx/html/ && \
    echo "=== HTML files in root after moving ===" && \
    find /usr/share/nginx/html -maxdepth 1 -name "*.html" | sort

# Enhanced debugging after copy
RUN echo "=== All HTML files in nginx after fix ===" && \
    find /usr/share/nginx/html -type f -name "*.html" | sort

# Fix all internal HTML links to point to root instead of /pages/
RUN find /usr/share/nginx/html -type f -name "*.html" -exec sed -i 's/href="pages\//href="/g' {} \;

# Copy additional assets for redundancy
COPY --from=build /app/src/assets/ /usr/share/nginx/html/assets/

# Create simpler nginx config with proper routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    root /usr/share/nginx/html; \
    \
    location / { \
    index index.html; \
    # Make sure to check for <file>.html explicitly in routing \
    try_files $uri $uri.html $uri/ /index.html; \
    } \
    \
    # For assets with caching \
    location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$ { \
    expires 30d; \
    add_header Cache-Control "public, no-transform"; \
    } \
    \
    # Debug request logging \
    error_log /var/log/nginx/error.log debug; \
    access_log /var/log/nginx/access.log combined; \
    }' > /etc/nginx/conf.d/default.conf

# Enhanced debugging for the nginx contents
RUN echo "=== Nginx HTML directory content ===" && \
    find /usr/share/nginx/html -maxdepth 1 -type f -name "*.html" | sort && \
    echo "=== Nginx root level files ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "=== Nginx config ===" && \
    cat /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

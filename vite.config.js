import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs-extra';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        /assets\/js\/.+\.js$/,  // Tratar todos los scripts en assets/js como externos
      ],
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
        blog: resolve(__dirname, 'src/pages/blog.html'),
        blogDetails: resolve(__dirname, 'src/pages/blog-details.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
        error: resolve(__dirname, 'src/pages/error.html'),
        faq: resolve(__dirname, 'src/pages/faq.html'),
        pricing: resolve(__dirname, 'src/pages/pricing.html'),
        project: resolve(__dirname, 'src/pages/project.html'),
        projectTwo: resolve(__dirname, 'src/pages/project-two.html'),
        projectDetails: resolve(__dirname, 'src/pages/project-details.html'),
        service: resolve(__dirname, 'src/pages/service.html'),
        serviceDetails: resolve(__dirname, 'src/pages/service-details.html'),
        team: resolve(__dirname, 'src/pages/team.html'),
        teamDetails: resolve(__dirname, 'src/pages/team-details.html'),
      }
    },
    outDir: '../dist',
  },
  plugins: [
    {
      name: 'copy-assets',
      writeBundle() {
        fs.copySync('assets', 'dist/assets');
      }
    }
  ],
  root: 'src', 
  server: {
    open: 'pages/index.html',
  }
});
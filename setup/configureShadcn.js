// setup/configureShadcn.js
const { execSync } = require("child_process");
const fs = require("fs");

function configureShadcn() {
  execSync("npm install -D @types/node", { stdio: "inherit" });
  fs.writeFileSync(
    "vite.config.ts",
    `import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`
  );
  execSync("npx shadcn@2.3.0 init", { stdio: "inherit" });
  execSync("npx shadcn add button", { stdio: "inherit" });
}

module.exports = configureShadcn;

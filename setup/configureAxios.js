const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { writeFile } = require("../utils/writeFile");
const { ensureDir } = require("../utils/ensureDir");

function configureAxios(projectPath, isDashSankhya) {
  if (!isDashSankhya) return;

  const libPath = path.join(projectPath, "src", "lib");
  ensureDir(libPath);
  const queryFilePath = path.join(__dirname, "../templates/query.txt");
  const queryContent = fs.readFileSync(queryFilePath, "utf8");
  writeFile(path.join(libPath, "query.ts"), queryContent);

  execSync("npm install @insulino/vite-plugin-2sankhyabi", {
    stdio: "inherit",
  });

  const viteConfig = `
import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'
import { convertToSankhyaBI } from "@insulino/vite-plugin-2sankhyabi"

export default defineConfig({
  plugins: [react(), { ...convertToSankhyaBI(), apply: "build" }],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
  `;
  writeFile(path.join(projectPath, "vite.config.ts"), viteConfig);
}

module.exports = configureAxios;

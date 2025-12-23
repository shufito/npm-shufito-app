// setup/configureTailwind.js
const { execSync } = require("child_process");
const fs = require("fs");

function configureTailwind() {
  execSync("npm install -D tailwindcss@3 postcss autoprefixer", {
    stdio: "inherit",
  });

  execSync("npx tailwindcss init -p", { stdio: "inherit" });

  fs.writeFileSync(
    "tailwind.config.js",
    `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`
  );

  fs.writeFileSync(
    "src/index.css",
    `@tailwind base;
    @tailwind components;
    @tailwind utilities;`
  );
}

module.exports = configureTailwind;

// setup/configureTailwind.js
const { execSync } = require("child_process");
const fs = require("fs");

function configureTailwind() {
  execSync("npm install tailwindcss @tailwindcss/vite", {
    stdio: "inherit",
  });
  execSync("npx tailwindcss init -p", { stdio: "inherit" });

  fs.writeFileSync("src/index.css", `@import "tailwindcss";`);
}

module.exports = configureTailwind;

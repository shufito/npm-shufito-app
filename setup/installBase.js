// setup/installBase.js
const { execSync } = require("child_process");

function installBase() {
  execSync("npm install", { stdio: "inherit" });
}

module.exports = installBase;

// setup/createProject.js
const { execSync } = require("child_process");

function createProject(projectName) {
  console.log(`🚀 Criando projeto ${projectName} com Vite...`);
  execSync(`npm create vite@latest ${projectName} -- --template react-swc-ts`, {
    stdio: "inherit",
  });
}

module.exports = createProject;

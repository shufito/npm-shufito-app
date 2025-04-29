const { default: inquirer } = require("inquirer");
const { execSync } = require("child_process");
const configureAxios = require("../setup/configureAxios");

async function askLibraries(projectPath) {
  const answers = await inquirer.prompt([
    {
      type: "checkbox",
      name: "libraries",
      message: "Quais bibliotecas extras deseja instalar?",
      choices: [
        { name: "React Hook Form", value: "react-hook-form" },
        { name: "React Query", value: "@tanstack/react-query" },
        { name: "Axios", value: "axios" },
        { name: "Zod (validação de schemas)", value: "zod" },
      ],
    },
  ]);

  if (answers.libraries.length > 0) {
    console.log(`📦 Instalando: ${answers.libraries.join(", ")}`);
    execSync(`npm install ${answers.libraries.join(" ")}`, {
      stdio: "inherit",
    });
  }

  if (answers.libraries.includes("axios")) {
    const { isDashSankhya } = await inquirer.prompt([
      {
        type: "confirm",
        name: "isDashSankhya",
        message: "O projeto será um Dash Sankhya?",
        default: false,
      },
    ]);

    if (isDashSankhya) {
      configureAxios(projectPath, isDashSankhya);
    }
  }
}

module.exports = askLibraries;

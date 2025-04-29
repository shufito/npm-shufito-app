#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");

const createProject = require("./setup/createProject");
const installBase = require("./setup/installBase");
const configureTailwind = require("./setup/configureTailwind");
const configureTypescript = require("./setup/configureTypescript");
const configureShadcn = require("./setup/configureShadcn");
const askLibraries = require("./prompts/askLibraries");

const projectName = process.argv[2] || "my-app";
const projectPath = path.join(process.cwd(), projectName);

async function run() {
  if (fs.existsSync(projectPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `A pasta ${projectName} já existe. Deseja sobrescrever?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log("❌ Operação cancelada.");
      process.exit(1);
    }

    fs.rmSync(projectPath, { recursive: true, force: true });
  }

  createProject(projectName);
  process.chdir(projectPath);
  installBase();
  configureTailwind();
  configureTypescript();
  configureShadcn();
  await askLibraries(projectPath);

  console.log("\n✅ Projeto configurado! Rode:");
  console.log(`\n  cd ${projectName}`);
  console.log("  npm run dev\n");
}

run();

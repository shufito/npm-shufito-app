#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer").default;

const projectName = process.argv[2] || "my-app";
const projectPath = path.join(process.cwd(), projectName);

console.log(`🚀 Criando projeto ${projectName} com Vite, Tailwind e ShadCN...`);

// Passo 1: Criar projeto com Vite
execSync(`npm create vite@latest ${projectName} -- --template react-swc-ts`, {
  stdio: "inherit",
});

// Passo 2: Instalar dependências
process.chdir(projectPath);
execSync("npm install", { stdio: "inherit" });

// Passo 3: Instalar Tailwind e configurar
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

fs.writeFileSync(
  "tsconfig.json",
  `{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`
);

fs.writeFileSync(
  "tsconfig.json",
  `{
    "files": [],
    "references": [
      {
        "path": "./tsconfig.app.json"
      },
      {
        "path": "./tsconfig.node.json"
      }
    ],
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }`
);

fs.writeFileSync(
  "tsconfig.app.json",
  `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": ["src"]
}
`
);

// Passo 4: Instalar e configurar ShadCN
execSync("npm install -D @types/node", { stdio: "inherit" });

fs.writeFileSync(
  "vite.config.ts",
  `import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
`
);

execSync("npx shadcn@latest init", { stdio: "inherit" });
execSync("npx shadcn@latest add button", { stdio: "inherit" });

async function askLibraries() {
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
    console.log(
      `📦 Instalando bibliotecas extras: ${answers.libraries.join(", ")}`
    );
    execSync(`npm install ${answers.libraries.join(" ")}`, {
      stdio: "inherit",
    });
  }

  if (answers.libraries.includes("axios")) {
    const ans = await inquirer.prompt([
      {
        type: "confirm",
        name: "isDashSankhya",
        message: "O projeto será um Dash Sankhya?",
        default: false,
      },
    ]);

    if (ans.isDashSankhya) {
      const libPath = path.join(projectPath, "src", "lib");
      if (!fs.existsSync(libPath)) {
        fs.mkdirSync(libPath); // Cria a pasta lib se não existir
      }

      fs.writeFileSync(
        "src/lib/query.ts",
        `import axios from "axios";

// Configuração do axios (opcional)
const axiosInstance = axios.create({
  baseURL: \`\${window.location.origin}/mge\`,
  withCredentials: true, // Inclui cookies automaticamente
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

// Função genérica para requisições POST
const postRequest = async <T>(
  url: string,
  body: any,
  options: { headers?: any; raw?: boolean } = {}
): Promise<T> => {
  const { headers = {}, raw = false } = options;

  try {
    const response = await axiosInstance.post(url, body, {
      headers,
    });

    const data = response.data;
    if (data.status !== "1") {
      throw new Error(
        \`\${data.statusMessage || "Erro desconhecido."}\`
      );
    }
    return raw ? (response as any) : data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || \`Erro na requisição: \${error.message}\`
    );
  }
};

// Função para parsear datas personalizadas
const parseCustomDate = (dateString: string): string | null => {
  const regex = /^(\d{2})(\d{2})(\d{4})/; // Captura dia, mês e ano
  const match = dateString?.match(regex);

  if (!match) return null;

  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day); // Cria o objeto Date
  return date.toISOString();
};

// Função para parsear o retorno da query
const parseQueryResponse = (response: any) => {
  let parsedData =
    typeof response === "string" ? JSON.parse(response) : response;

  parsedData = parsedData.data?.responseBody || parsedData.responseBody || {};
  const fields = parsedData.fieldsMetadata || [];
  const rows = parsedData.rows || [];

  return rows.map((row: any) =>
    fields.reduce((acc: any, field: any, i: number) => {
      let value = row[i];

      if (typeof value === "string" && /^\d{8}/.test(value)) {
        const parsedDate = parseCustomDate(value);
        value = parsedDate || value;
      }

      return { ...acc, [field.name]: value };
    }, {})
  );
};

// Função para executar queries
export const fetchQuery = async (queryText: string) => {
  if (!queryText) throw new Error("Query não pode estar vazia.");

  const formattedQuery = queryText.replace(/(\\r\\n|\\n|\\r)/gm, "");
  const url = \`/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json\`;
  const body = {
    serviceName: "DbExplorerSP.executeQuery",
    requestBody: { sql: formattedQuery },
  };

  const response = await postRequest(url, body);
  return parseQueryResponse(response);
};
`
      );
      execSync("npm i @insulino/vite-plugin-2sankhyabi", { stdio: "inherit" });
      fs.writeFileSync(
        "vite.config.ts",
        `import { defineConfig } from 'vite'
      import path from "path"
      import react from '@vitejs/plugin-react-swc'
      import { convertToSankhyaBI } from "@insulino/vite-plugin-2sankhyabi"
      
      // https://vite.dev/config/
      export default defineConfig({
        plugins: [react(), { ...convertToSankhyaBI(), apply: "build" }],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
      })
      `
      );
    }
  }

  console.log("\n✅ Projeto configurado! Rode:");
  console.log(`\n  cd ${projectName}`);
  console.log("  npm run dev\n");
}

askLibraries(); // Chamando a função

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- PRESETS ---
const presets = {
  // 1. Vite (React/Vue/Svelte) - Padrão moderno
  vite: {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }]
  },

  // 2. Node.js Moderno (Backend puro)
  node: {
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      lib: ["ES2022"],
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      noImplicitAny: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "**/*.spec.ts"]
  },

  // 3. Next.js (Framework)
  next: {
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }]
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  },

  // 4. Base (Genérico)
  base: {
    compilerOptions: {
      target: "ESNext",
      module: "ESNext",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    }
  }
};

// --- LÓGICA DO CLI ---
const args = process.argv.slice(2);
const type = args[0] ? args[0].toLowerCase() : null;
const shouldInit = args.includes('-y') || args.includes('--init');

if (!type || !presets[type]) {
  console.log('\x1b[31m%s\x1b[0m', '❌ Erro: Especifique um preset: vite, node, next ou base.');
  console.log('Exemplo: npx mytsfy vite');
  console.log('Opções: -y ou --init para rodar "npm init -y" automaticamente.');
  process.exit(1);
}

const configContent = JSON.stringify(presets[type], null, 2);
const filePath = path.join(process.cwd(), 'tsconfig.json');

if (fs.existsSync(filePath)) {
  console.log('\x1b[33m%s\x1b[0m', '⚠️  Já existe um tsconfig.json aqui! Delete-o para gerar um novo.');
} else {
  fs.writeFileSync(filePath, configContent);
  console.log('\x1b[32m%s\x1b[0m', `✅ tsconfig.json criado com sucesso (Preset: ${type})`);
}

// Executa npm init -y se a flag for passada
if (shouldInit) {
  const pkgPath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(pkgPath)) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️  package.json já existe. Ignorando npm init.');
  } else {
    try {
      console.log('📦 Executando npm init -y...');
      execSync('npm init -y', { stdio: 'inherit' });
      console.log('\x1b[32m%s\x1b[0m', '✅ package.json criado!');
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '❌ Erro ao executar npm init.');
    }
  }
}

if (type === 'vite') {
    console.log('\x1b[36m%s\x1b[0m', '💡 Dica: Para Vite, lembre-se de conferir se o tsconfig.node.json existe.');
}
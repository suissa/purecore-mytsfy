#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- 1. CONFIGURAÇÃO DOS DECORATORS ---
const getPresets = (isExperimental) => {
  // Se a flag --experimental for passada, adicionamos essas props
  const commonDecorators = isExperimental ? {
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  } : {};

  return {
    // --- PRESET VITE (MULTI-ARQUIVO) ---
    vite: {
      type: 'multi',
      files: [
        {
          filename: 'tsconfig.json', // O orquestrador
          content: {
            files: [],
            references: [
              { path: "./tsconfig.app.json" },
              { path: "./tsconfig.node.json" }
            ]
          }
        },
        {
          filename: 'tsconfig.app.json', // O Frontend
          content: {
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
              moduleDetection: "force",
              noEmit: true,
              jsx: "react-jsx",
              strict: true,
              noUnusedLocals: true,
              noUnusedParameters: true,
              noFallthroughCasesInSwitch: true,
              ...commonDecorators // <--- Injeta aqui se for experimental
            },
            include: ["src"]
          }
        },
        {
          filename: 'tsconfig.node.json', // O Backend de Build
          content: {
            compilerOptions: {
              target: "ES2022",
              lib: ["ES2022"],
              module: "ESNext",
              skipLibCheck: true,
              moduleResolution: "bundler",
              allowImportingTsExtensions: true,
              isolatedModules: true,
              moduleDetection: "force",
              noEmit: true,
              strict: true,
              noUnusedLocals: true,
              noUnusedParameters: true,
              noFallthroughCasesInSwitch: true
            },
            include: ["vite.config.ts"]
          }
        }
      ]
    },

    // --- PRESET NODE (SINGLE FILE) ---
    node: {
      type: 'single',
      content: {
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
          forceConsistentCasingInFileNames: true,
          ...commonDecorators // <--- Injeta aqui (Essencial para NestJS/TypeORM)
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "**/*.spec.ts"]
      }
    },

    // --- PRESET NEXT (SINGLE FILE) ---
    next: {
      type: 'single',
      content: {
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
          plugins: [{ name: "next" }],
          ...commonDecorators // <--- Injeta aqui também
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"]
      }
    }
  };
};

// --- CLI LOGIC ---
const args = process.argv.slice(2);
const type = args[0] ? args[0].toLowerCase() : null;
const shouldInit = args.includes('-y') || args.includes('--init');
const isExperimental = args.includes('--experimental');

const presets = getPresets(isExperimental);

// Menu de Ajuda se errar o comando
if (!type || !presets[type]) {
  console.log('\x1b[31m%s\x1b[0m', '❌ Erro: Especifique um preset válido.');
  console.log('\nUso: npx mytsfy <preset> [opcoes]');
  console.log('\nPresets:');
  console.log('  vite   (React, Vue, Svelte - Cria 3 arquivos)');
  console.log('  node   (Backend, Scripts - Cria 1 arquivo)');
  console.log('  next   (Next.js - Cria 1 arquivo)');
  console.log('\nOpções:');
  console.log('  -y, --init      Roda "npm init -y" automaticamente');
  console.log('  --experimental  Ativa decorators (experimentalDecorators, emitDecoratorMetadata)');
  process.exit(1);
}

const selectedPreset = presets[type];

// --- GENERATOR FUNCTIONS ---
const writeJson = (filename, content) => {
  const filePath = path.join(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    console.log('\x1b[33m%s\x1b[0m', `⚠️  ${filename} já existe. Pulando.`);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log('\x1b[32m%s\x1b[0m', `✅ ${filename} criado.`);
  }
};

console.log(`🚀 Gerando configs para: ${type.toUpperCase()}...\n`);

if (selectedPreset.type === 'multi') {
  selectedPreset.files.forEach(file => writeJson(file.filename, file.content));
} else {
  writeJson('tsconfig.json', selectedPreset.content);
}

// --- NPM INIT ---
if (shouldInit) {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    try {
      console.log('\n📦 Executando npm init -y...');
      execSync('npm init -y', { stdio: 'inherit' });
    } catch (e) {
      console.error('❌ Erro no npm init');
    }
  }
}

// Feedback visual
if (isExperimental) {
  console.log('\n\x1b[35m%s\x1b[0m', '🧪 Experimental Decorators ativados! (NestJS/TypeORM ready)');
}
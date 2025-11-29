# 📚 Guia Definitivo das Opções do TSConfig

> Este documento serve como referência completa para entender o que cada flag faz, quais são os valores possíveis e, o mais importante, como elas afetam umas às outras.

## 📋 Navegação Rápida

- [📦 Módulos & Resolução](#-módulos--resolução-critical-zone)
- [🎯 Output & Compilação](#-output--compilação-emit)
- [🛡️ Segurança de Tipos](#️-segurança-de-tipos-strictness)
- [🧪 Experimental & Decorators](#-experimental--decorators)
- [📚 Bibliotecas & Ambiente](#-bibliotecas--ambiente)

---

## 📦 Módulos & Resolução (Critical Zone)

> ⚠️ **Estas são as configurações mais importantes.** Se você errar aqui, seus imports vão quebrar.

### `module`

Define o formato de código JavaScript que será gerado para os módulos.

#### Valores Possíveis:

| Valor | Descrição |
|-------|-----------|
| `CommonJS` | O padrão antigo do Node.js (`require`) |
| `ESNext` | Sintaxe moderna ECMAScript (`import`/`export`) |
| `NodeNext` / `Node16` | Modo estrito para Node.js moderno (suporta ESM e CJS) |
| `Preserve` | Novo no TS 5.4 - deixa imports para bundler |

#### Quando usar:

- **Node.js (Antigo)**: `CommonJS`
- **Vite/Webpack (Frontend)**: `ESNext`
- **Node.js (Moderno/Híbrido)**: `NodeNext`

#### 🔗 Dependências & Ligações:

> ⚠️ **CRÍTICO**: Mudar o `module` geralmente muda o padrão do `moduleResolution`.

- Se você usar `NodeNext`, o `moduleResolution` deve ser `NodeNext`
- Se você usar `CommonJS`, o `target` não pode ser muito moderno

---

### `moduleResolution`

Define o algoritmo usado para encontrar os arquivos quando você faz um import.

#### Valores Possíveis:

| Valor | Descrição |
|-------|-----------|
| `node` / `node10` | Algoritmo clássico do Node (obsoleto) |
| `node16` / `nodenext` | Algoritmo rigoroso do Node moderno |
| `bundler` | Novo padrão TS 5.0+ para bundlers |
| `classic` | Nunca use - só legado |

#### Quando usar:

- **Vite/Next.js (App)**: `bundler`
- **Biblioteca/Backend Node**: `NodeNext`

#### 🔗 Dependências & Ligações:

- **Ligação**: Se `module: NodeNext`, esta opção é forçada para `NodeNext`
- **Ligação**: Se `bundler`, provavelmente precisa `allowImportingTsExtensions: true`

---

### `esModuleInterop`

A "mágica" que permite interoperabilidade entre CommonJS e ES Modules.

```typescript
// Com esModuleInterop: true
import React from 'react'; // ✅ Funciona

// Sem esModuleInterop
import * as React from 'react'; // ❌ Necessário
```

#### Valores Possíveis: `true` | `false`

**O que faz**: Permite `import React from 'react'` mesmo que a biblioteca use `module.exports`.

#### 🔗 Dependências & Ligações:

- **Ligação**: Ativar habilita automaticamente `allowSyntheticDefaultImports`

---

### `isolatedModules`

Garante que cada arquivo seja seguro para ser transpilado isoladamente.

#### Valores Possíveis: `true` | `false`

**O que faz**: O TypeScript avisa se você escrever código que ferramentas como esbuild, babel ou swc não conseguem entender.

#### Quando usar:
> ✅ **Obrigatório** se você usa Vite, Next.js, Babel ou qualquer bundler moderno

---

## 🎯 Output & Compilação (Emit)

Controla o que sai do compilador.

### `target`

Define a versão do JavaScript gerado.

#### Valores Possíveis:
- `ES5`, `ES6/ES2015`, `ES2016`... `ESNext`

**O que faz**: Controla se features modernas geram polyfills extras ou ficam limpas.

#### 🔗 Dependências & Ligações:

- **Ligação Direta**: O valor padrão da opção `lib` muda dependendo do `target`
- **Dica**: Node 18+ use `ES2022`, Vite moderno use `ES2020`

---

### `noEmit`

Não gera arquivos JavaScript.

#### Valores Possíveis: `true` | `false`

#### Quando usar:
> ✅ **Quase sempre** em projetos modernos (Vite/Next.js)

**Por que?** O bundler gera o JS, não o `tsc`.

---

### `outDir`

Pasta onde os arquivos `.js` compilados serão salvos.

```json
{
  "outDir": "./dist"
}
```

#### 🔗 Dependências & Ligações:

> ⚠️ **Sempre use `outDir`** se `noEmit: false` para evitar bagunça

---

### `declaration`

Gera arquivos de definição de tipos (`.d.ts`).

#### Valores Possíveis: `true` | `false`

#### Quando usar:
> ✅ **Essencial** para bibliotecas, desnecessário para apps

#### 🔗 Dependências & Ligações:

- **Ligação**: Necessário se `composite: true`

---

## 🛡️ Segurança de Tipos (Strictness)

### `strict`

O "modo Deus" da segurança de tipos.

#### Valores Possíveis: `true` | `false`

**O que faz**: Ativa todas as flags de segurança (`noImplicitAny`, `strictNullChecks`, etc.).

> ✅ **Recomendação**: Sempre `true`. Começar com `false` é dívida técnica.

---

### `skipLibCheck`

Ignora checagem de tipos nos arquivos `.d.ts` das bibliotecas.

#### Valores Possíveis: `true` | `false`

#### Por que usar `true`?

- 🚀 **Performance**: Compila muito mais rápido
- 🧠 **Sanidade**: Evita falhas por erros em libs de terceiros

---

## 🧪 Experimental & Decorators

### `experimentalDecorators`

Habilita o uso de Decorators (`@Component`, `@Injectable`).

#### Valores Possíveis: `true` | `false`

#### Quando usar:
> ✅ **Obrigatório** para Angular, NestJS, TypeORM, MobX

#### 🔗 Dependências & Ligações:

- **Ligação**: Geralmente usado com `emitDecoratorMetadata`

---

### `emitDecoratorMetadata`

Emite metadados de design-type para decorators.

#### Valores Possíveis: `true` | `false`

**O que faz**: Permite frameworks descobrirem tipos em tempo de execução para DI.

#### 🔗 Dependências & Ligações:

- **Pré-requisito**: `experimentalDecorators: true`

---

## 📚 Bibliotecas & Ambiente

### `lib`

Define quais tipos globais o TypeScript conhece.

#### Valores Comuns:

| Valor | Descrição |
|-------|-----------|
| `DOM` | Tipos do navegador (`window`, `HTMLElement`) |
| `DOM.Iterable` | Permite `for..of` em `NodeLists` |
| `ESNext` | Tipos modernos do JavaScript |

#### 🔗 Dependências & Ligações:

> ⚠️ **CRÍTICO**: Backend (Node) = **NÃO** inclua `DOM`

---

### `jsx`

Controla como o TS lida com a sintaxe JSX.

#### Valores Possíveis:

| Valor | Descrição |
|-------|-----------|
| `preserve` | Mantém `<div />` (Next.js/Vite) |
| `react-jsx` | Transforma para `_jsx()` (React 17+) |
| `react` | Transforma para `React.createElement()` |

---

## 🎯 Resumo dos Presets MyTSFy

### Vite (Frontend)
```json
{
  "module": "ESNext",
  "moduleResolution": "bundler",
  "target": "ES2020",
  "lib": ["DOM", "DOM.Iterable", "ESNext"],
  "jsx": "react-jsx",
  "noEmit": true,
  "isolatedModules": true,
  "strict": true
}
```

### Node (Backend)
```json
{
  "module": "NodeNext",
  "moduleResolution": "NodeNext",
  "target": "ES2022",
  "lib": ["ES2022"],
  "outDir": "./dist",
  "strict": true
}
```

### Next.js
```json
{
  "target": "es5",
  "lib": ["dom", "dom.iterable", "es6"],
  "jsx": "preserve",
  "incremental": true,
  "strict": true
}
```

---

> 💡 **Dica Final**: Use o MyTSFy para gerar essas configurações automaticamente!
>
> ```bash
> npx mytsfy vite  # Para projetos Vite
> npx mytsfy node  # Para backend Node.js
> npx mytsfy next  # Para Next.js
> ```
<p align="center">
<img src="https://i.imgur.com/BS0L1m8.png" align="center" width=600 />
  <h2 align="center"><strong>Pare de copiar e colar configs velhas do StackOverflow ou corrigindo configs erradas geradas pela IA.</strong></h2>
  <p align="center">O MyTSFy gera arquivos <code>tsconfig.json</code> modernos e otimizados para as stacks atuais (Vite, Next.js, Node 20+).</p>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/mytsfy?style=flat-square&color=blue" alt="npm version">
  <img src="https://img.shields.io/npm/dm/mytsfy?style=flat-square&color=green" alt="downloads">
  <img src="https://img.shields.io/github/license/suissa/purecore-mytsfy?style=flat-square&color=orange" alt="license">
</p>

---

## 🚀 Uso Rápido (Sem Instalar)

```bash
npx mytsfy vite
```

## 📋 Opções Disponíveis

### Presets Suportados

| Preset | Descrição |
|--------|-----------|
| `vite` | Configuração multi-arquivo para Vite + React/Vue |
| `node` | Backend moderno com Node.js 18+ |
| `next` | Configuração específica para Next.js |

### Flags Adicionais

#### Gerar package.json automático
Adicione a flag `-y` para rodar `npm init -y` logo após criar o config:

```bash
npx mytsfy node -y
```

#### Ativar Decorators (Experimental)
Essencial para frameworks que usam injeção de dependência (NestJS) ou ORMs (TypeORM):

```bash
npx mytsfy node --experimental
```

Isso adiciona `experimentalDecorators: true` e `emitDecoratorMetadata: true`.

## 📦 Instalação Global (Opcional)

Se preferir ter o comando sempre à mão:

```bash
npm install -g mytsfy
```

## 🧠 Por Dentro dos Presets (Deep Dive)

Entenda as escolhas técnicas feitas por cada preset.

### 1. Preset `vite` (Arquitetura Multi-Arquivo)

O Vite moderno exige que você separe o código que roda no navegador do código que roda no Node (arquivos de config).

#### `tsconfig.json`: Apenas um orquestrador
- Não tem regras, só aponta para os outros arquivos

#### `tsconfig.app.json` (Seu código Frontend):
```json
{
  "lib": ["DOM"],           // Permite usar window, document, etc.
  "moduleResolution": "bundler", // Novo padrão TS 5.0+
  "noEmit": true            // TS não gera JS, Vite faz isso
}
```

- `"moduleResolution": "bundler"`: Diz ao TS que um bundler (Vite/Rollup) vai resolver os imports
- `"noEmit": true`: O TS não gera arquivos JS. Quem faz a transpilação é o Vite (usando esbuild/rollup)

#### `tsconfig.node.json` (Configurações do Build):
```json
{
  "include": ["vite.config.ts"], // Aplica apenas aos arquivos de config
  // Sem lib DOM: Previne uso de variáveis globais do browser
}
```

### 2. Preset `node` (Backend Moderno)

Focado em Node.js versões 18 ou superior.

```json
{
  "module": "NodeNext",
  "moduleResolution": "NodeNext",
  "outDir": "./dist",
  "strict": true
}
```

#### Explicação das configurações:
- `"module": "NodeNext"` & `"moduleResolution": "NodeNext"`: Habilita suporte nativo do Node para ES Modules e CommonJS simultaneamente
- `"outDir": "./dist"`: Organização básica para deploy
- `"strict": true`: Habilita todas as verificações rigorosas (noImplicitAny, strictNullChecks, etc.)

### 3. Preset `next` (The Framework Way)

O Next.js exige configurações muito específicas. Segue a recomendação oficial:

```json
{
  "target": "es5",
  "jsx": "preserve",
  "plugins": [{ "name": "next" }],
  "incremental": true
}
```

#### Explicação das configurações:
- `"target": "es5"`: Parece antigo, mas é proposital. O SWC do Next moderniza o código depois
- `"jsx": "preserve"`: TS não transforma JSX, deixa para SWC/Babel fazerem otimizado
- `"plugins": [{ "name": "next" }]`: Melhorias de intellisense específicas do Next.js
- `"incremental": true`: Cache (.tsbuildinfo) para builds muito mais rápidos

## 🧪 Decorators (Flag `--experimental`)

Útil para quem usa NestJS, TypeORM ou Angular.

### O que habilita:
- `experimentalDecorators`: Permite usar `@Decorator` em classes
- `emitDecoratorMetadata`: Emite metadados sobre tipos das propriedades

### Exemplo NestJS:

```typescript
@Controller('cats')
export class CatsController {
  // O TS emite metadata dizendo que 'service' é do tipo 'CatsService'
  constructor(private readonly service: CatsService) {}
}
```

## 🤝 Contribuição

Feito para salvar seu tempo. Sinta-se à vontade para contribuir!

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  Made with 💜 by the PureCore team
</p>

<p align="center">
  <a href="https://github.com/purecore/mytsfy">⭐ Star us on GitHub</a>
</p>
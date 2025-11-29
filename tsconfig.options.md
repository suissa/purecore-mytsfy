Guia Definitivo das Opções do TSConfig

Este documento serve como referência para entender o que cada flag faz, quais são os valores possíveis e, o mais importante, como elas afetam umas às outras.

📦 Módulos & Resolução (Critical Zone)

Estas são as configurações mais importantes. Se você errar aqui, seus imports vão quebrar.

module

Define o formato de código JavaScript que será gerado para os módulos.

Valores Possíveis:

CommonJS: O padrão antigo do Node.js (require).

ESNext: A sintaxe mais moderna do padrão ECMAScript (import/export).

NodeNext / Node16: O modo estrito e correto para Node.js moderno (suporta tanto ESM quanto CJS dependendo da extensão do arquivo).

Preserve: (Novo no TS 5.4) Deixa os imports como estão para um bundler tratar.

Quando usar:

Node.js (Antigo): CommonJS.

Vite/Webpack (Frontend): ESNext.

Node.js (Moderno/Híbrido): NodeNext.

🔗 Dependências & Ligações:

CRÍTICO: Mudar o module geralmente muda o padrão do moduleResolution.

Se você usar NodeNext, o moduleResolution deve ser NodeNext.

Se você usar CommonJS, o target não pode ser muito moderno se você espera rodar em ambientes velhos.

moduleResolution

Define o algoritmo usado para encontrar os arquivos quando você faz um import.

Valores Possíveis:

node (ou node10): O algoritmo clássico do Node (procura em node_modules, index.js, etc). Obsoleto para projetos modernos.

node16 / nodenext: Algoritmo rigoroso do Node moderno. Exige extensões em imports ESM (import ./foo.js) e respeita o "exports" do package.json.

bundler: O novo padrão (TS 5.0+). Feito para Vite, Webpack, esbuild. Simula como os bundlers funcionam (não exige extensões, entende "exports").

classic: Nunca use. Só existe por legado.

Quando usar:

Vite/Next.js (App): bundler.

Biblioteca/Backend Node: NodeNext.

🔗 Dependências & Ligações:

Ligação: Se você usa module: NodeNext, esta opção é forçada para NodeNext.

Ligação: Se você usa bundler, você provavelmente precisa de allowImportingTsExtensions: true se quiser importar arquivos .ts diretamente (comum no Vite).

esModuleInterop

A "mágica" que permite interoperabilidade entre CommonJS e ES Modules.

Valores Possíveis: true | false

O que faz: Permite fazer import React from 'react' mesmo que a biblioteca React tenha sido exportada como module.exports = ... (CommonJS). Sem isso, você teria que usar import * as React from 'react'.

Recomendação: Sempre true em projetos novos.

🔗 Dependências & Ligações:

Ligação: Ativar isso habilita automaticamente allowSyntheticDefaultImports.

isolatedModules

Garante que cada arquivo seja seguro para ser transpilado isoladamente.

Valores Possíveis: true | false

O que faz: O TypeScript avisa se você escrever código que ferramentas como esbuild, babel ou swc não conseguem entender (como const enum ou re-exportar tipos sem a palavra-chave type).

Quando usar: Obrigatório se você usa Vite, Next.js, Babel ou qualquer bundler moderno que não usa o compilador oficial do TS para gerar o JS.

🎯 Output & Compilação (Emit)

Controla o que sai do compilador.

target

Define a versão do JavaScript gerado.

Valores Possíveis: ES5, ES6/ES2015, ES2016... ESNext.

O que faz: Se você usar uma feature nova (como async/await) e o target for antigo (ES5), o TS vai gerar um monte de código extra (polyfills) para fazer funcionar. Se o target for novo (ESNext), ele mantém a sintaxe limpa.

🔗 Dependências & Ligações:

Ligação Direta: O valor padrão da opção lib muda dependendo do target. Se target: ES6, a lib inclui ES6 por padrão.

Dica: Para Node 18+, use ES2022. Para Vite moderno, ES2020 é um bom equilíbrio. ES5 só é necessário para IE11 ou sistemas muito legados.

noEmit

Não gera arquivos JavaScript.

Valores Possíveis: true | false

Quando usar: Quase sempre em projetos modernos (Vite/Next.js).

Por que? Porque quem gera o JS nesses projetos é o Bundler (Vite/Webpack), não o tsc. O tsc roda apenas para checar erros de tipo (Type Checking).

outDir

Pasta onde os arquivos .js compilados serão salvos.

Exemplo: ./dist ou ./build.

🔗 Dependências & Ligações:

Se você não definir isso, os arquivos .js serão criados lado a lado com os .ts na pasta src, o que faz uma bagunça enorme. Sempre use outDir se noEmit for false.

declaration

Gera arquivos de definição de tipos (.d.ts).

Valores Possíveis: true | false

Quando usar: Essencial se você está criando uma Biblioteca (library) para ser usada por outros. Desnecessário para Apps finais.

🔗 Dependências & Ligações:

Ligação: Necessário se composite: true.

🛡️ Segurança de Tipos (Strictness)

strict

O "modo Deus" da segurança.

Valores Possíveis: true | false

O que faz: Ativa uma família inteira de flags de segurança de uma vez só (noImplicitAny, strictNullChecks, strictFunctionTypes, etc).

Recomendação: Sempre true. Começar um projeto com strict: false é pedir para ter dívida técnica.

skipLibCheck

Ignora a checagem de tipos dentro dos arquivos de definição (.d.ts) das bibliotecas (node_modules).

Valores Possíveis: true | false

Por que usar true?

Performance: Compila muito mais rápido.

Sanidade: Muitas vezes uma lib no node_modules tem um erro de tipo interno que você não pode consertar. Você não quer que seu build falhe por culpa de uma lib de terceiros.

🧪 Experimental & Decorators

experimentalDecorators

Habilita o uso de Decorators (@Component, @Injectable).

Valores Possíveis: true | false

Quando usar: Obrigatório para Angular, NestJS, TypeORM, MobX (versões antigas).

🔗 Dependências & Ligações:

Ligação: Geralmente usado em conjunto com emitDecoratorMetadata.

emitDecoratorMetadata

Emite metadados de design-type para decorators.

Valores Possíveis: true | false

O que faz: Permite que frameworks (como NestJS) descubram os tipos dos parâmetros no construtor em tempo de execução para fazer Injeção de Dependência.

🔗 Dependências & Ligações:

Só funciona se experimentalDecorators: true.

📚 Bibliotecas & Ambiente

lib

Define quais tipos globais o TypeScript deve "conhecer" (ex: window, document, Promise, Map).

Valores Comuns:

DOM: Tipos do navegador (window, HTMLElement).

DOM.Iterable: Permite usar for..of em NodeLists.

ESNext: Tipos modernos do JS.

🔗 Dependências & Ligações:

CRÍTICO: Se você está no Backend (Node), NÃO inclua DOM. Isso evita que você use window sem querer no servidor.

Se você não definir, o TS assume libs baseadas no seu target.

jsx

Controla como o TS lida com a sintaxe JSX (<div />).

Valores Possíveis:

preserve: Mantém o <div /> no output. (Usado por Next.js/Vite, pois outro transformador fará o trabalho depois).

react-jsx: Transforma para _jsx("div", ...) (React 17+ automático).

react: Transforma para React.createElement("div", ...) (React antigo).
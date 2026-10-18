# PGATS — Automação Web 2026

- Projeto de estudos de automação de testes end-to-end (E2E) com Cypress, desenvolvido sobre a aplicação [Automation Exercise](https://automationexercise.com/). 
- O repositório reúne exemplos progressivos de criação e organização de testes, desde cenários escritos diretamente nas specs até a separação por módulos de ações de negócio.

## Tecnologias

- Node.js e npm
- Cypress 13
- Faker para geração de dados
- `cypress-xpath` para seletores XPath
- Mochawesome para relatórios HTML
- GitHub Actions para integração contínua
- BrowserStack para execução remota

## Cenários cobertos

Entre os fluxos automatizados estão:

- cadastro e exclusão de usuário;
- login válido, login inválido e logout;
- tentativa de cadastro com e-mail já existente;
- consulta, detalhamento e pesquisa de produtos;
- assinatura da newsletter;
- carrinho, checkout e pagamento;
- múltiplas janelas e drag and drop;
- exercícios com seletores XPath;
- exemplos intencionais de testes com falha.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 22 ou versão compatível
- npm
- acesso à internet para abrir a aplicação testada

## Instalação

Clone o repositório, acesse sua pasta e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd pgats-automacao-web-2026
npm ci
```

## Variáveis de ambiente

Alguns cenários usam um usuário previamente cadastrado. Crie um arquivo `cypress.env.json` na raiz do projeto:

```json
{
  "email": "usuario@exemplo.com",
  "senha": "sua-senha"
}
```

O arquivo está no `.gitignore` e não deve ser versionado. Em CI, os mesmos valores são fornecidos pelos secrets `EMAIL` e `SENHA` por meio das variáveis `CYPRESS_email` e `CYPRESS_senha`.

## Execução dos testes

Para abrir a interface interativa do Cypress:

```bash
npm run cy:open
```

Para executar toda a suíte em modo headless:

```bash
npm test
```

Para executar somente uma spec:

```bash
npx cypress run --spec "cypress/e2e/3-test-cases-exercice-modules.cy.js"
```

> A spec `cypress/e2e/5-failing-tests.cy.js` contém falhas intencionais para fins de estudo. Ao executar a suíte completa, essas falhas podem fazer o comando terminar com status de erro.

## Relatórios

O projeto usa `cypress-mochawesome-reporter`. Após a execução headless, os artefatos são gerados em:

```text
cypress/reports/
```

Screenshots de testes com falha são armazenados em `cypress/screenshots/`. As duas pastas são ignoradas pelo Git.

## Estrutura do projeto

```text
.
├── .github/workflows/       # Pipeline de testes no GitHub Actions
├── cypress/
│   ├── e2e/                 # Specs e exercícios automatizados
│   ├── fixtures/            # Massas de dados reutilizáveis
│   ├── modules/             # Ações de negócio agrupadas por funcionalidade
│   └── support/             # Configuração global e comandos customizados
├── browserstack.json        # Configuração de execução no BrowserStack
├── cypress.config.js        # Configuração principal do Cypress
├── diretrizes-*.md          # Evolução das diretrizes de arquitetura
├── RELATORIO-SELETORES-XPATH.md
└── package.json
```

## Arquitetura dos testes

A organização mais recente do projeto adota módulos de ações de negócio:

- as **specs** descrevem e orquestram os cenários;
- os **módulos** encapsulam interações, seletores e asserções por funcionalidade;
- as **fixtures** mantêm os dados reutilizáveis separados da implementação;
- os nomes das ações são orientados ao comportamento do usuário.

Exemplos de módulos disponíveis: `login`, `cadastro`, `produto`, `carrinho`, `checkout`, `pagamento`, `assinatura`, `logout` e `delete`.

As decisões e convenções completas estão documentadas em `diretrizes-arquitetura-projeto-v3.md`.

## Integração contínua

O workflow `.github/workflows/cypress.yml` executa os testes no Electron a cada `push`, `pull_request` ou disparo manual. Ao final, publica o relatório Mochawesome e, em caso de falha, os screenshots como artefatos por sete dias.

## BrowserStack

Para usar a execução remota, configure credenciais válidas no `browserstack.json` local e execute:

```bash
npx browserstack-cypress run
```

## Observações

- A URL base configurada é `https://automationexercise.com/`.


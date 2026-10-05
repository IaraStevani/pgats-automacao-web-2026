Diretrizes de Modularização e Arquitetura dos Testes Cypress
Contexto

Este projeto utiliza Cypress para automação de testes E2E.

Os testes devem ser modularizados de forma a separar claramente:

Cenários e comportamento dos testes (spec);

Ações de negócio da aplicação;

Seletores dos elementos;

Dados utilizados nos cenários.

O objetivo é reduzir duplicação, facilitar manutenção e tornar as specs mais legíveis e orientadas ao comportamento do usuário.

Arquitetura adotada

A arquitetura esperada é baseada em módulos de Ações de Negócio.

Não utilizar a nomenclatura:

Pages;

Page Objects;

PageObject;

*Page.js;

classes representando páginas.

Em vez disso, utilizar módulos que representem contextos ou ações de negócio.

Exemplos:

acoes/
├── usuario/
│   ├── login.js
│   ├── cadastro.js
│   └── logout.js
├── produto/
│   └── consulta.js
└── pedido/
    └── checkout.js

Módulos

Os módulos devem utilizar funções e module.exports, evitando classes.

Exemplo:

const elementos = {
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoEntrar: '[data-qa="login-button"]',
  usuarioAutenticado: '.navbar-nav li'
}

function acessarLogin() {
  cy.visit('/login')
}

function efetuarLogin(email, senha) {
  cy.get(elementos.email).type(email)
  cy.get(elementos.senha).type(senha)
  cy.get(elementos.botaoEntrar).click()
}

function validarLoginRealizado(nome) {
  cy.get(elementos.usuarioAutenticado)
    .contains(nome)
    .should('be.visible')
}

module.exports = {
  acessarLogin,
  efetuarLogin,
  validarLoginRealizado
}

Seletores

Os seletores devem ficar fora da spec e próximos das funções de Ação de Negócio que os utilizam.

Preferencialmente, os seletores devem permanecer no próprio módulo quando estiverem diretamente relacionados àquelas ações.

Exemplo:

const elementos = {
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoEntrar: '[data-qa="login-button"]'
}


Não espalhar seletores diretamente pelas specs quando eles puderem ser encapsulados no módulo de Ações de Negócio.

A spec não deve precisar conhecer detalhes como:

cy.get('[data-qa="login-email"]')
cy.get('[data-qa="login-password"]')
cy.get('[data-qa="login-button"]')


Ela deve trabalhar com ações de negócio.

Nomenclatura das funções

As funções utilizadas diretamente pelas specs devem utilizar Português do Brasil e representar ações ou comportamentos de negócio.

Preferir:

efetuarLogin()
cadastrarUsuario()
validarUsuarioAutenticado()
efetuarLogout()
preencherDadosDoUsuario()
validarMensagemDeErro()


Evitar:

login()
createUser()
clickLogin()
fillEmail()
assertUser()


A função deve representar o que o usuário ou o negócio está fazendo, e não apenas a operação técnica realizada pelo Cypress.

Exemplos

Preferir:

login.efetuarLogin(email, senha)


em vez de:

login.preencherEmail(email)
login.preencherSenha(senha)
login.clicarBotao()


Preferir:

cadastro.cadastrarUsuario(dadosUsuario)


em vez de:

cadastro.preencherNome(nome)
cadastro.preencherEmail(email)
cadastro.preencherSenha(senha)
cadastro.clicarCadastrar()


Operações menores podem existir internamente quando forem necessárias para organizar a implementação, mas a interface utilizada pela spec deve priorizar ações de negócio.

Responsabilidade da Spec

A spec deve descrever o cenário de forma clara e próxima da linguagem utilizada nos requisitos.

Exemplo:

const login = require('../../acoes/usuario/login')

describe('Login de usuário', () => {

  it('Efetuar Login de Usuário com email e senha corretos', () => {
    login.acessarLogin()
    login.efetuarLogin(usuario.email, usuario.senha)
    login.validarLoginRealizado(usuario.nome)
  })

})


A spec não deve conter detalhes de implementação da interface quando esses detalhes puderem ser encapsulados nas Ações de Negócio.

Evitar:

cy.visit('/login')
cy.get('[data-qa="login-email"]').type(email)
cy.get('[data-qa="login-password"]').type(senha)
cy.get('[data-qa="login-button"]').click()
cy.get('.navbar-nav li').contains(nome).should('be.visible')

Dados de teste

Dados de teste devem ser mantidos separados da implementação das Ações de Negócio sempre que fizer sentido.

Podem ser utilizados fixtures ou outra estrutura apropriada para dados reutilizáveis.

Exemplo:

fixtures/
└── usuarios.json

{
  "usuarioValido": {
    "nome": "PGATS Aut",
    "email": "teste@mail.com",
    "senha": "12345"
  }
}


A ação deve receber os dados necessários como parâmetros, em vez de manter dados específicos do cenário internamente.

Exemplo:

function efetuarLogin(email, senha) {
  // implementação
}


e não:

function efetuarLogin() {
  const email = 'teste@mail.com'
  const senha = '12345'

  // implementação
}

Princípios gerais

Ao refatorar os testes existentes:

Preservar o comportamento dos cenários originais.

Reduzir duplicação de código.

Remover detalhes de implementação das specs.

Encapsular seletores nas Ações de Negócio.

Criar funções reutilizáveis para comportamentos recorrentes.

Utilizar nomes de funções em Português do Brasil.

Priorizar nomes orientados ao negócio em vez de nomes técnicos.

Utilizar módulos com funções e module.exports.

Evitar classes para representar ações ou páginas.

Não utilizar a nomenclatura Page, Pages ou Page Object.

Manter os dados de teste separados das ações quando houver reutilização.

Evitar criar abstrações excessivas para ações que não possuem reutilização ou valor de negócio.

Regra principal

A arquitetura deve buscar esta separação:

SPEC
  ↓
Cenário de negócio
  ↓
Ações de Negócio
  ↓
Seletores + interação com a aplicação
  ↓
Aplicação


Em termos práticos:

A Spec diz O QUE está sendo testado.

A Ação de Negócio define COMO realizar aquela operação.

Os seletores definem ONDE interagir na aplicação.

Os dados definem COM QUAIS informações executar o cenário.


O resultado esperado é que uma pessoa consiga ler uma spec e entender o comportamento sendo validado sem precisar conhecer os seletores CSS, data-qa, estrutura HTML ou detalhes internos da implementação.
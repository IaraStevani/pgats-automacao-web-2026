Diretrizes de Modularização e Arquitetura dos Testes Cypress
Contexto

Este projeto utiliza Cypress para automação de testes E2E.

Os testes devem ser modularizados de forma a separar claramente:

Cenários e comportamento dos testes (spec);

Ações de negócio da aplicação;

Seletores dos elementos;

Asserções;

Dados utilizados nos cenários.

O objetivo é reduzir duplicação, facilitar manutenção e tornar as specs mais legíveis e orientadas ao comportamento do usuário.

Arquitetura adotada

A arquitetura é baseada em módulos de Ações de Negócio.

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

Cada módulo deve concentrar as funções relacionadas a um determinado contexto ou comportamento de negócio.

Exemplo:

const seletores = {
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoEntrar: '[data-qa="login-button"]',
  mensagemErro: 'form[action*="login"] > p'
}

function acessarLogin() {
  cy.visit('/login')
}

function efetuarLogin(email, senha) {
  cy.get(seletores.email).type(email)
  cy.get(seletores.senha).type(senha)
  cy.get(seletores.botaoEntrar).click()
}

module.exports = {
  acessarLogin,
  efetuarLogin
}

Seletores

Os seletores devem ficar fora da spec e próximos das funções de Ação de Negócio que os utilizam.

O grupo de seletores de um módulo deve ser armazenado em uma constante chamada seletores.

Exemplo:

const seletores = {
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoEntrar: '[data-qa="login-button"]'
}


Não utilizar nomes genéricos ou variantes como:

const elements = {}
const elementos = {}
const selectors = {}
const campos = {}


Para os módulos deste projeto, o nome padrão é:

const seletores = {}


A spec não deve conhecer diretamente os seletores da aplicação.

Evitar:

cy.get('[data-qa="login-email"]')
cy.get('[data-qa="login-password"]')
cy.get('[data-qa="login-button"]')


A interação deve ser encapsulada pelas Ações de Negócio.

Granularidade das funções

Não é necessário criar uma função para cada interação individual com um elemento da página.

As funções devem possuir uma granularidade orientada à ação de negócio, podendo agrupar várias interações relacionadas.

Por exemplo, não é necessário criar:

informarNome()
informarEmail()
informarSenha()
selecionarPais()
clicarCadastrar()


quando essas interações fazem parte de uma única ação de negócio.

Pode-se criar uma função que agrupe essas operações:

function preencherDadosDoUsuario(usuario) {
  cy.get(seletores.nome).type(usuario.nome)
  cy.get(seletores.email).type(usuario.email)
  cy.get(seletores.senha).type(usuario.senha)
  cy.get(seletores.pais).select(usuario.pais)
}


Ou, quando fizer sentido para o comportamento, uma ação ainda mais completa:

function cadastrarUsuario(usuario) {
  preencherDadosDoUsuario(usuario)
  cy.get(seletores.botaoCadastrar).click()
}


A granularidade deve ser definida considerando:

Reutilização;

Clareza da spec;

Coesão da ação;

Complexidade do fluxo;

Facilidade de manutenção.

Evitar tanto:

funções excessivamente pequenas, que apenas encapsulam um único cy.get();

funções excessivamente grandes, que executam fluxos de negócio não relacionados.

A regra principal é:

Uma função deve representar uma ação ou conjunto coeso de interações que faça sentido no contexto do negócio.

Asserções

As asserções devem estar sempre nos módulos dedicados às Ações de Negócio.

As specs não devem conter asserções diretamente.

Evitar:

login.efetuarLogin(email, senha)

cy.get('.navbar-nav li')
  .contains('PGATS Aut')
  .should('be.visible')


Preferir:

login.efetuarLogin(email, senha)
login.validarUsuarioAutenticado('PGATS Aut')


O módulo é responsável tanto pela interação quanto pela validação relacionada àquele contexto.

Exemplo:

function validarUsuarioAutenticado(nome) {
  cy.get(seletores.usuarioAutenticado)
    .contains(nome)
    .should('be.visible')
}


As funções de validação também devem utilizar nomenclatura em Português do Brasil e representar o comportamento que está sendo validado.

Exemplos:

validarUsuarioAutenticado()
validarMensagemDeErro()
validarFormularioVisivel()
validarEmailObrigatorio()
validarCadastroRealizado()


A spec deve apenas solicitar a validação por meio da Ação de Negócio:

login.validarUsuarioAutenticado(usuario.nome)

Nomenclatura das funções

As funções utilizadas diretamente pelas specs devem utilizar Português do Brasil e representar ações ou comportamentos de negócio.

Preferir:

acessarLogin()
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

login.informarEmail(email)
login.informarSenha(senha)
login.clicarBotaoEntrar()


quando essas três interações representam uma única ação de negócio.

Preferir:

cadastro.cadastrarUsuario(usuario)


em vez de expor para a spec uma sequência de interações técnicas:

cadastro.informarNome(nome)
cadastro.informarEmail(email)
cadastro.informarSenha(senha)
cadastro.clicarCadastrar()


Operações menores podem existir internamente no módulo quando contribuírem para organização, reutilização ou legibilidade.

Entretanto, elas não precisam necessariamente ser exportadas ou utilizadas diretamente pela spec.

Responsabilidade da Spec

A spec deve descrever o cenário de forma clara e próxima da linguagem utilizada nos requisitos.

Exemplo:

const login = require('../acoes/usuario/login')

describe('Login de usuário', () => {
  it('deve efetuar login com email e senha corretos', () => {
    login.acessarLogin()
    login.efetuarLogin(usuario.email, usuario.senha)
    login.validarUsuarioAutenticado(usuario.nome)
  })
})


A spec deve ser responsável por:

Organizar os cenários;

Definir os dados utilizados no cenário;

Orquestrar as Ações de Negócio na ordem necessária.

A spec não deve ser responsável por:

Conhecer seletores;

Interagir diretamente com elementos da aplicação;

Implementar regras de interação;

Realizar asserções;

Repetir fluxos de negócio.

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


As ações devem receber os dados necessários como parâmetros.

Exemplo:

function efetuarLogin(email, senha) {
  cy.get(seletores.email).type(email)
  cy.get(seletores.senha).type(senha)
}


Evitar manter dados específicos de cenários diretamente dentro das Ações de Negócio:

function efetuarLogin() {
  const email = 'teste@mail.com'
  const senha = '12345'

  // implementação
}

Organização de responsabilidades

A separação esperada é:

SPEC
  ↓
Cenário de negócio
  ↓
Ações de Negócio
  ├── Interações
  ├── Seletores
  └── Asserções
  ↓
Aplicação


Os dados ficam separados:

Dados de teste
  ↓
SPEC
  ↓
Ações de Negócio

Princípios gerais

Ao refatorar os testes existentes:

Preservar o comportamento dos cenários originais.

Reduzir duplicação de código.

Remover detalhes de implementação das specs.

Encapsular seletores nas Ações de Negócio.

Utilizar const seletores = {} para armazenar os seletores.

Criar funções reutilizáveis para comportamentos recorrentes.

Não criar obrigatoriamente uma função para cada elemento ou interação individual.

Agrupar interações relacionadas em funções coesas.

Utilizar nomes de funções em Português do Brasil.

Priorizar nomes orientados ao negócio em vez de nomes técnicos.

Colocar todas as asserções nos módulos de Ações de Negócio.

Utilizar módulos com funções e module.exports.

Evitar classes para representar ações ou páginas.

Não utilizar a nomenclatura Page, Pages ou Page Object.

Manter os dados de teste separados das ações quando houver reutilização.

Evitar criar abstrações excessivas para ações que não possuem reutilização ou valor de negócio.

Manter a spec responsável principalmente pela organização e orquestração dos cenários.

Regra principal

A arquitetura deve buscar esta separação:

A Spec descreve O QUE está sendo testado.

A Ação de Negócio define COMO realizar aquela operação.

Os seletores definem ONDE interagir na aplicação.

As asserções definem COMO validar o resultado da ação.

Os dados definem COM QUAIS informações executar o cenário.


Em termos práticos, uma spec deve permitir que uma pessoa compreenda o comportamento testado sem precisar conhecer:

Seletores CSS;

data-qa;

Estrutura HTML;

Detalhes de interação com elementos;

Implementação das validações.

O objetivo final é que a automação seja orientada ao comportamento e às ações de negócio, mantendo os detalhes técnicos encapsulados nos módulos responsáveis por implementá-los.
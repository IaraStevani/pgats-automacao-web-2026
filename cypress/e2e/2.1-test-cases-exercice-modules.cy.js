/// <reference types="cypress" />
const { iniciarCadastro, preencherCadastro, verificarSeCadastroFoiEfetuadoComSucesso, verificarSeMensagemDeCadastroExistenteFoiExibida } = require('../modules/cadastro');
const { preencherLogin, verificarSeLoginFoiEfetuadoComSucesso, verificarSeMensagemDeErroFoiExibidaNoLogin } = require('../modules/login');
const { efeturarLogout, verificarSeLogoutFoiEfetuado } = require('../modules/logout');
const { excluirConta, verificarSeContaFoiExcluidaComSucesso } = require('../modules/delete');

describe('Tests Cases', () => {
    it('CT-1: Cadastrar usuário', () => {
        cy.visit('/');
        cy.get('a[href*=login]').click();

        iniciarCadastro('PGATS Aut', `pgats-aut-test-${Date.now()}@mail.com`);
        preencherCadastro();
        verificarSeCadastroFoiEfetuadoComSucesso();

        excluirConta();
        verificarSeContaFoiExcluidaComSucesso();
    });

    it('CT-2: Login do usuário com e-mail e senha corretos', () => {
        cy.visit('/');
        cy.get('a[href*=login]').click();

        preencherLogin('pgats-aut-test-1791051625531@mail.com', '123456');
        verificarSeLoginFoiEfetuadoComSucesso();
    });

    it('CT-3: Login do usuário com e-mail e senha incorretos', () => {
        cy.visit('/');
        cy.get('a[href*=login]').click();

        preencherLogin('pgats-aut-test-1791051625531@mail.com', '123')
        verificarSeMensagemDeErroFoiExibidaNoLogin();
    });

    it('CT-4: Fazer logout do usuário', () => {
        cy.visit('/');
        cy.get('a[href*=login]').click();

        efeturarLogout();
        verificarSeLogoutFoiEfetuado();
    });

    it('CT-5: Cadastrar usuário com e-mail duplicado', () => {
        cy.visit('/');
        cy.get('a[href*=login]').click();

        iniciarCadastro('PGATS Aut', 'pgats-aut-test@mail.com');
        verificarSeMensagemDeCadastroExistenteFoiExibida();
    });    
});

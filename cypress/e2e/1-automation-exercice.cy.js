/// <reference types="cypress" />

const dadosCadastro = require('../fixtures/cadastro.json');

describe('Automation Exercise', () => {

    it('deve cadastrar novo usuário com sucesso', () => {

        // Gera um e-mail diferente a cada execução
        const emailDinamico = `pgats-aut-${Date.now()}@email.com`;

        cy.visit('/');
        cy.get('a[href*=login]').click();

        cy.get('[data-qa="signup-name"]').type(dadosCadastro.signUpName); // Usando dados da fixture cadastro.json 
        cy.get('[data-qa="signup-email"]').type(emailDinamico);

        cy.get('[data-qa="signup-button"]').click();

        cy.get('#id_gender2').check();

        cy.get('[data-qa="password"]').type('123456');

        // Selects e Comboboxes -> select
        cy.get('[data-qa="days"]').select('1');
        cy.get('[data-qa="months"]').select('January');
        cy.get('[data-qa="years"]').select('2000');

        // Checkboxes -> check        
        cy.get('#newsletter').check();
        cy.get('#optin').check();

        cy.get('[data-qa="first_name"]').type('Maria');
        cy.get('[data-qa="last_name"]').type('Silva');
        cy.get('[data-qa="address"]').type('Rua Teste, 123');
        cy.get('[data-qa="country"]').select('Israel');
        cy.get('[data-qa="state"]').type('Jerusalem');
        cy.get('[data-qa="city"]').type('Tel Aviv');
        cy.get('[data-qa="zipcode"]').type('6492103');
        cy.get('[data-qa="mobile_number"]').type('+972 123456789');

        cy.get('[data-qa="create-account"]').click();
        cy.get('[data-qa="continue-button"]').click();

        cy.contains('a', 'Logout').should('be.visible');
    });

    it('Efetuar Login de Usuário com email e senha corretos', () => {
        // ARRANGE
        /**
         * Ter uma conta para efetuar o Login
         * pgats-aut-test-1791030872114@mail.com / 12345
         */

        // acesso a página de login
        // Problema 1: Repetição do cy.visit
        cy.visit('https://www.automationexercise.com/login')

        // ACT
        cy.get('[data-qa="login-email"]').type('pgats-aut-test-1791030872114@mail.com')
        cy.get('[data-qa="login-password"]').type('12345')

        cy.get('[data-qa="login-button"]').click()
        // cy.contains('Login') 

        // ASSERT
        // cy.get('a').should('contain', 'PGATS Aut')
        // cy.get('a > b').should('contain', 'PGATS Aut')


        // 
        // cy.contains('Logged in as PGATS Auto').should('be.visible')
        cy.contains('.navbar-nav li', 'PGATS Aut')

        cy.get('.navbar-nav li')
            .contains('PGATS Aut')
            .should('be.visible')

    });

    it('Efetuar Login de Usuário email e senha INCORRETOS', () => {
        cy.visit('https://www.automationexercise.com/login')

        // ACT
        cy.get('[data-qa="login-email"]').type('pgats-aut-test-1791030872114@mail.com')
        cy.get('[data-qa="login-password"]').type('54321')

        cy.get('[data-qa="login-button"]').click()

        cy.get('form[action*="login"] > p')
            .should('exist')
            .should('be.visible')
            .should('contain', 'Your email or password is incorrect!')
            .and('contain.text', 'Your email or password is incorrect!')

    });

    it('Efetuar Logout', () => {
        cy.visit('https://www.automationexercise.com/login')

        // ACT
        cy.get('[data-qa="login-email"]').type('pgats-aut-test-1791030872114@mail.com')
        cy.get('[data-qa="login-password"]').type('12345')
        cy.get('[data-qa="login-button"]').click()

        // assert do login
        cy.get('a[href*="logout"]')
            .should('be.visible')
            .click()

        cy.get('.login-form > h2').should('be.visible')
        cy.get('a[href*="logout"]').should('not.exist')
        cy.get('[action*="login"]').should('be.visible');
        cy.url().should('include', 'login')

        // https://www.automationexercise.com/login -> 'login'

    });

    it('Tentar cadastrar usuário com e-mail já cadastrado', () => {
        cy.visit('https://www.automationexercise.com')
        cy.get('a[href*=login]').click()

        // const timestamp = new Date().getTime()

        cy.get('[data-qa="signup-name"]').type(`PGATS Aut`)
        // cy.get('[data-qa="signup-email"]').type(`pgats-aut-test-${timestamp}@mail.com`)
        cy.get('[data-qa="signup-email"]').type(`pgats-aut-test-1791030872114@mail.com`)

        cy.get('[data-qa="signup-button"]').click()

        cy.get('form[action*=signup] p')
            .should('exist')
            .should('be.visible')
            .should('contain', 'Email Address already exist!')
            .and('contain.text', 'Email Address already exist!')
    });
});

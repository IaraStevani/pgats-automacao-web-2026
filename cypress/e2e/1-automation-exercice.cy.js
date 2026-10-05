/// <reference types="cypress" />

describe('Automation Exercise', () => {
   
    it('deve cadastrar novo usuário com sucesso', () => {
        // Gera um e-mail diferente a cada execução
        const emailDinamico = `pgats-aut-${Date.now()}@email.com`;

        cy.visit('https://automationexercise.com/');
        cy.get('a[href*=login]').click();

        cy.get('[data-qa="signup-name"]').type('PGATS Aut');
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
});
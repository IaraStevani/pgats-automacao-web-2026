/// <reference types="cypress" />

describe('adaptar os seletores para usar xpath', () => {
    it('deve validar cadastro em branco', () => {
        cy.visit('https://automationexercise.com/');
        cy.xpath('//a[contains(@href, "login")]').click();

        cy.xpath('//input[@data-qa="signup-name"]').type('PGATS Aut');

        cy.xpath('//button[@data-qa="signup-button"]').click();

        cy.xpath('//input[@data-qa="signup-email"]').then(($input) => {
            expect($input[0].checkValidity()).to.be.false;
            expect($input[0].validationMessage).to.be.not.empty;
        });
    });
});
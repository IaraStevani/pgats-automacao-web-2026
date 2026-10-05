 function efeturarLogout() {
        cy.get('.login-form > h2').should('contain.text', 'Login to your account');

        cy.get('[data-qa="login-email"]').type('pgats-aut-test@email2.com');
        cy.get('[data-qa="login-password"]').type('123456');

        cy.get('[data-qa="login-button"]').click();

        cy.get('.fa-user').should('be.visible');
    }

    function verificarSeLogoutFoiEfetuado() {
        cy.get('a[href="/logout"]')
            .should('exist')
            .should('be.visible')
            .should('be.visible').click();

        cy.get('.login-form > h2')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Login to your account');
    }

    module.exports = {
        efeturarLogout,
        verificarSeLogoutFoiEfetuado
    }
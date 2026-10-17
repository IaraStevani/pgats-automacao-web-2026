function acessarPaginaDeLogin() {
        cy.get('a[href*="login"]').click();
    }

function preencherLogin(email, senha) {
        cy.get('.login-form > h2').should('contain.text', 'Login to your account');

        cy.get('[data-qa="login-email"]').type(email);
        cy.get('[data-qa="login-password"]').type(senha);

        cy.get('[data-qa="login-button"]').click();
    }

    function verificarSeLoginFoiEfetuadoComSucesso() {
        cy.contains('Logged in ').should('be.visible');

        cy.get('a[href="/logout"]')
            .should('exist')
            .should('be.visible')
            .should('be.visible');
    }

    function verificarSeMensagemDeErroFoiExibidaNoLogin() {
        cy.get('.login-form > form > p')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Your email or password is incorrect!');
    }

    module.exports = {
        acessarPaginaDeLogin,
        preencherLogin,
        verificarSeLoginFoiEfetuadoComSucesso,
        verificarSeMensagemDeErroFoiExibidaNoLogin
    }

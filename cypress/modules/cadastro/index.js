function iniciarCadastro(nome, email) {
    cy.get('[data-qa="signup-name"]').type(nome)
    cy.get('[data-qa="signup-email"]').type(email)
    cy.get('[data-qa="signup-button"]').click()
}

function preencherCadastro() {
    cy.get('#id_gender2').check();
    cy.get('[data-qa="password"]').type('123456');

    cy.get('[data-qa="days"]').select('1');
    cy.get('[data-qa="months"]').select('January');
    cy.get('[data-qa="years"]').select('2000');

    cy.get('[data-qa="first_name"]').type('Maria');
    cy.get('[data-qa="last_name"]').type('Silva');
    cy.get('[data-qa="address"]').type('Rua Teste, 123');
    cy.get('[data-qa="country"]').select('Israel');
    cy.get('[data-qa="state"]').type('Jerusalem');
    cy.get('[data-qa="city"]').type('Tel Aviv');
    cy.get('[data-qa="zipcode"]').type('6492103');
    cy.get('[data-qa="mobile_number"]').type('+972 123456789');
}

function verificarSeCadastroFoiEfetuadoComSucesso() {
    cy.get('[data-qa="create-account"]').click()
    cy.get('[data-qa="account-created"]')
        .should('exist')
        .should('be.visible')
        .and('contain', 'Account Created!')

    cy.get('[data-qa="continue-button"]')
        .should('be.visible')
        .click();
}

function verificarSeMensagemDeCadastroExistenteFoiExibida() {
    cy.get('.signup-form > form > p')
        .should('exist')
        .should('be.visible')
        .should('contain.text', 'Email Address already exist!');
}

module.exports = {
    iniciarCadastro,
    preencherCadastro,
    verificarSeCadastroFoiEfetuadoComSucesso,
    verificarSeMensagemDeCadastroExistenteFoiExibida
}
function verificarSecaoDeAssinatura() {
  cy.get('.single-widget > h2')
    .should('be.visible')
    .and('contain.text', 'Subscription');
}

function realizarAssinatura(email) {
  cy.get('#susbscribe_email').type(email);
  cy.get('#subscribe').click();
}

function verificarAssinaturaRealizada() {
  cy.get('.alert-success')
    .should('be.visible')
    .and('contain.text', 'You have been successfully subscribed!');
}

module.exports = {
  verificarSecaoDeAssinatura,
  realizarAssinatura,
  verificarAssinaturaRealizada
};

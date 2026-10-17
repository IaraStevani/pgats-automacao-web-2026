function iniciarCheckout() {
    cy.get('.col-sm-6 > .btn').click();
}

function verificarDetalhesDoPedido() {
    cy.contains('.heading', 'Address Details').should('be.visible');
    cy.contains('.heading', 'Review Your Order').should('be.visible');
}

function informarComentario(comentario) {
    cy.get('.form-control').type(comentario);
}

function prosseguirParaPagamento() {
    cy.get('.btn-default.check_out').click();
}

module.exports = {
    iniciarCheckout,
    verificarDetalhesDoPedido,
    informarComentario,
    prosseguirParaPagamento
};

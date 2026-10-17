function preencherPagamento(dadosCartao) {
    cy.get('[data-qa="name-on-card"]').type(dadosCartao.nome);
    cy.get('[data-qa="card-number"]').type(dadosCartao.numero);
    cy.get('[data-qa="cvc"]').type(dadosCartao.cvc);
    cy.get('[data-qa="expiry-month"]').type(dadosCartao.mes);
    cy.get('[data-qa="expiry-year"]').type(dadosCartao.ano);
    cy.get('[data-qa="pay-button"]').click();
}

function verificarPedidoRealizado() {
    cy.get('[data-qa="order-placed"]')
        .should('be.visible')
        .and('contain.text', 'Order Placed!');
    cy.contains('Congratulations! Your order has been confirmed!')
        .should('be.visible');
    cy.get('[data-qa="continue-button"]').click();
}

module.exports = {
    preencherPagamento,
    verificarPedidoRealizado
};

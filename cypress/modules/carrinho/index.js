function adicionarPrimeiroProdutoAoCarrinho() {
    cy.get('a[data-product-id="1"]').first().click();
}

function acessarCarrinho() {
    cy.contains('u', 'View Cart').click();
    cy.get('.active')
        .should('be.visible')
        .and('contain.text', 'Shopping Cart');
}

module.exports = {
    adicionarPrimeiroProdutoAoCarrinho,
    acessarCarrinho
};

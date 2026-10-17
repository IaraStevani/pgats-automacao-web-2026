function acessarProdutos() {
  cy.get('a[href="/products"]').click();
  cy.url().should('include', '/products');
}

function acessarPrimeiroProduto() {
  cy.get('a[href="/product_details/1"]').click();
}

function verificarDetalhesDoProduto() {
  cy.get('.product-information')
    .should('be.visible')
    .and('contain.text', 'Blue Top')
    .and('contain.text', 'Category: Women > Tops')
    .and('contain.text', 'Rs. 500')
    .and('contain.text', 'Availability: In Stock')
    .and('contain.text', 'Condition: New')
    .and('contain.text', 'Brand: Polo');
}

function pesquisarProduto(termo) {
  cy.get('#search_product').type(termo);
  cy.get('#submit_search').click();
}

function verificarResultadoDaPesquisa(nomeProduto, preco) {
  cy.get('.title')
    .should('be.visible')
    .and('contain.text', 'Searched Products');

  cy.get('.productinfo')
    .should('be.visible')
    .and('contain.text', nomeProduto)
    .and('contain.text', preco);
}

module.exports = {
  acessarProdutos,
  acessarPrimeiroProduto,
  verificarDetalhesDoProduto,
  pesquisarProduto,
  verificarResultadoDaPesquisa
};

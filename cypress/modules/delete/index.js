function excluirConta(){
    cy.get('a[href="/delete_account"]')
        .should('exist')
        .and('be.visible')
        .click();
}

function verificarSeContaFoiExcluidaComSucesso(){
    cy.get('[data-qa="account-deleted"]')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Account Deleted!');
}

module.exports = {
    excluirConta,
    verificarSeContaFoiExcluidaComSucesso
}

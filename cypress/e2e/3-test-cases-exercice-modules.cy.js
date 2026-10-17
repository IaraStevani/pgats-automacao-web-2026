/// <reference types="cypress" />
const { iniciarCadastro, preencherCadastro, verificarSeCadastroFoiEfetuadoComSucesso, verificarSeMensagemDeCadastroExistenteFoiExibida } = require('../modules/cadastro');
const { acessarPaginaDeLogin, preencherLogin, verificarSeLoginFoiEfetuadoComSucesso, verificarSeMensagemDeErroFoiExibidaNoLogin } = require('../modules/login');
const { efeturarLogout, verificarSeLogoutFoiEfetuado } = require('../modules/logout');
const { excluirConta, verificarSeContaFoiExcluidaComSucesso } = require('../modules/delete');
const { acessarProdutos, acessarPrimeiroProduto, verificarDetalhesDoProduto, pesquisarProduto, verificarResultadoDaPesquisa } = require('../modules/produto');
const { verificarSecaoDeAssinatura, realizarAssinatura, verificarAssinaturaRealizada } = require('../modules/assinatura');
const { adicionarPrimeiroProdutoAoCarrinho, acessarCarrinho } = require('../modules/carrinho');
const { iniciarCheckout, verificarDetalhesDoPedido, informarComentario, prosseguirParaPagamento } = require('../modules/checkout');
const { preencherPagamento, verificarPedidoRealizado } = require('../modules/pagamento');
const dadosPagamento = require('../fixtures/pagamento.json');

describe('Tests Cases Modules', () => {
    it('CT-1: Cadastrar usuário', () => {
        cy.visit('/');

        acessarPaginaDeLogin();
        iniciarCadastro('PGATS Aut', `pgats-aut-test-${Date.now()}@mail.com`);
        preencherCadastro();
        verificarSeCadastroFoiEfetuadoComSucesso();

        excluirConta();
        verificarSeContaFoiExcluidaComSucesso();
    });

    it('CT-2: Login do usuário com e-mail e senha corretos', () => {
        cy.visit('/');

        acessarPaginaDeLogin();
        preencherLogin('pgats-aut-test-1791051625531@mail.com', '123456');
        verificarSeLoginFoiEfetuadoComSucesso();
    });

    it('CT-3: Login do usuário com e-mail e senha incorretos', () => {
        cy.visit('/');

        acessarPaginaDeLogin();
        preencherLogin('pgats-aut-test-1791051625531@mail.com', '123')
        verificarSeMensagemDeErroFoiExibidaNoLogin();
    });

    it('CT-4: Fazer logout do usuário', () => {
        cy.visit('/');

        acessarPaginaDeLogin();
        efeturarLogout();
        verificarSeLogoutFoiEfetuado();
    });

    it('CT-5: Cadastrar usuário com e-mail duplicado', () => {
        cy.visit('/');

        acessarPaginaDeLogin();
        iniciarCadastro('PGATS Aut', 'pgats-aut-test@mail.com');
        verificarSeMensagemDeCadastroExistenteFoiExibida();
    });

    it('CT-8: Verificar todos os produtos e a página de detalhes do produto', () => {
        cy.visit('/');

        acessarProdutos();
        acessarPrimeiroProduto();
        verificarDetalhesDoProduto();
    });

    it('CT-9: Pesquisar produto', () => {
        cy.visit('/');

        acessarProdutos();
        pesquisarProduto('top');
        verificarResultadoDaPesquisa('Blue Top', 'Rs. 500');
    });

    it('CT-10: Verificar assinatura na página inicial', () => {
        cy.visit('/');

        verificarSecaoDeAssinatura();
        realizarAssinatura('pgats@email.com');
        verificarAssinaturaRealizada();
    });

    it('CT-15: Fazer pedido: Registre-se antes de finalizar a compra', () => {
        const email = `pgats-aut-test-${Date.now()}@mail.com`;

        cy.visit('/');

        acessarPaginaDeLogin();
        iniciarCadastro('PGATS Aut', email);
        preencherCadastro();
        verificarSeCadastroFoiEfetuadoComSucesso();

        acessarProdutos();
        adicionarPrimeiroProdutoAoCarrinho();
        acessarCarrinho();

        iniciarCheckout();
        verificarDetalhesDoPedido();
        informarComentario('Comentario cypress');
        prosseguirParaPagamento();

        preencherPagamento(dadosPagamento.cartaoValido);
        verificarPedidoRealizado();

        excluirConta();
        verificarSeContaFoiExcluidaComSucesso();
    });

    it('CT-16: Fazer pedido após realizar login', () => {
        const email = Cypress.env('email');
        const senha = Cypress.env('senha');

        cy.visit('/');

        acessarPaginaDeLogin();
        preencherLogin(email, senha);
        verificarSeLoginFoiEfetuadoComSucesso();

        acessarProdutos();
        adicionarPrimeiroProdutoAoCarrinho();
        acessarCarrinho();

        iniciarCheckout();
        verificarDetalhesDoPedido();
        informarComentario('Comentario cypress');
        prosseguirParaPagamento();

        preencherPagamento(dadosPagamento.cartaoValido);
        verificarPedidoRealizado();
    });
});

/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Tests Cases', () => {
    it('CT-1: Cadastrar usuário', () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const user = {
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }),
            password: faker.internet.password({ length: 12 }),
            birthDay: faker.number.int({ min: 1, max: 28 }).toString(),
            birthMonth: faker.date.month(),
            birthYear: faker.number.int({ min: 1950, max: 2005 }).toString(),
            firstName,
            lastName,
            address: faker.location.streetAddress(),
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            mobileNumber: faker.phone.number()
        };

        cy.visit('https://automationexercise.com/');
        cy.xpath("//a[contains(@href, '/login')]").click();

        cy.xpath("//div[contains(@class, 'signup-form')]/h2").should('contain.text', 'New User Signup!');

        cy.xpath("//*[@data-qa='signup-name']").type(user.name);
        cy.xpath("//*[@data-qa='signup-email']").type(user.email);
        cy.xpath("//*[@data-qa='signup-button']").click();

        cy.xpath("//*[contains(@class, 'title') and contains(@class, 'text-center')]")
            .should('contain.text', 'Enter Account Information');

        cy.xpath("//*[@id='id_gender2']").check();
        cy.xpath("//*[@data-qa='password']").type(user.password);

        // Selects e Comboboxes -> select
        cy.xpath("//*[@data-qa='days']").select(user.birthDay);
        cy.xpath("//*[@data-qa='months']").select(user.birthMonth);
        cy.xpath("//*[@data-qa='years']").select(user.birthYear);

        // Checkboxes -> check
        cy.xpath("//*[@id='newsletter']").check();
        cy.xpath("//*[@id='optin']").check();

        cy.xpath("//*[@data-qa='first_name']").type(user.firstName);
        cy.xpath("//*[@data-qa='last_name']").type(user.lastName);
        cy.xpath("//*[@data-qa='company']").type(faker.company.name());
        cy.xpath("//*[@data-qa='address']").type(user.address);
        cy.xpath("//*[@data-qa='address2']").type(faker.location.secondaryAddress());
        cy.xpath("//*[@data-qa='country']").select('Israel');
        cy.xpath("//*[@data-qa='state']").type(user.state);
        cy.xpath("//*[@data-qa='city']").type(user.city);
        cy.xpath("//*[@data-qa='zipcode']").type(user.zipcode);
        cy.xpath("//*[@data-qa='mobile_number']").type(user.mobileNumber);

        cy.xpath("//*[@data-qa='create-account']").click();

        cy.xpath("//b[contains(normalize-space(), 'Account Created!')]").should('be.visible');

        cy.xpath("//*[@data-qa='continue-button']").click();

        cy.xpath(`//*[contains(normalize-space(), 'Logged in as ${user.name}')]`).should('be.visible');

        cy.xpath("//a[@href='/logout']")
            .should('exist')
            .should('be.visible');

        cy.xpath("//a[@href='/delete_account']").click();

        cy.xpath("//*[@data-qa='account-deleted']")
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Account Deleted!');
    });

    it('CT-2: Login do usuário com e-mail e senha corretos', () => {

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        const user = {
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }),
            password: faker.string.alphanumeric(12)
        };

        // Cadastrar usuário pela API
        cy.request({
            method: 'POST',
            url: 'https://automationexercise.com/api/createAccount',
            form: true,
            body: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: 'Mrs',
                birth_date: '10',
                birth_month: '5',
                birth_year: '1995',
                firstname: firstName,
                lastname: lastName,
                company: faker.company.name(),
                address1: faker.location.streetAddress(),
                address2: faker.location.secondaryAddress(),
                country: 'Israel',
                state: faker.location.state(),
                city: faker.location.city(),
                zipcode: faker.location.zipCode(),
                mobile_number: faker.phone.number()
            }
        }).then(({ body }) => {
            const response = JSON.parse(body);

            expect(response.responseCode).to.eq(201);
        });

        cy.visit('https://automationexercise.com/');
        cy.xpath("//a[contains(@href, '/login')]").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' login-form ')]/h2").should('contain.text', 'Login to your account');

        cy.xpath("//*[@data-qa='login-email']").type(user.email);
        cy.xpath("//*[@data-qa='login-password']").type(user.password);

        cy.xpath("//*[@data-qa='login-button']").click();

        cy.xpath(`//*[contains(normalize-space(), 'Logged in as ${user.name}')]`).should('be.visible');

        cy.xpath("//a[@href='/logout']")
            .should('exist')
            .should('be.visible')
            .should('be.visible');

        cy.xpath("//a[@href='/delete_account']").click();

        cy.xpath("//*[@data-qa='account-deleted']")
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Account Deleted!');
    });

    it('CT-3: Login do usuário com e-mail e senha incorretos', () => {
        cy.visit('https://automationexercise.com/');
        cy.xpath("//a[contains(@href, '/login')]").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' login-form ')]/h2").should('contain.text', 'Login to your account');

        cy.xpath("//*[@data-qa='login-email']").type('pgats@email.com');
        cy.xpath("//*[@data-qa='login-password']").type('12345');

        cy.xpath("//*[@data-qa='login-button']").click();

        cy.xpath("//div[contains(@class, 'login-form')]//form/p")
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Your email or password is incorrect!');
    });

    it('CT-4: Fazer logout do usuário', () => {
        cy.visit('https://automationexercise.com/');
        cy.xpath("//a[contains(@href, '/login')]").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' login-form ')]/h2").should('contain.text', 'Login to your account');

        cy.xpath("//*[@data-qa='login-email']").type('pgats-aut-test@email2.com');
        cy.xpath("//*[@data-qa='login-password']").type('123456');

        cy.xpath("//*[@data-qa='login-button']").click();

        cy.xpath("//a[contains(normalize-space(), 'Logged in as')]").should('be.visible');

        cy.xpath("//a[@href='/logout']")
            .should('exist')
            .should('be.visible')
            .should('be.visible').click();

        cy.xpath("//div[contains(@class, 'login-form')]/h2")
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Login to your account');
    });

    it('CT-5: Cadastrar usuário com e-mail duplicado', () => {
        cy.visit('https://automationexercise.com/');
        cy.xpath("//a[contains(@href, '/login')]").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' signup-form ')]/h2").should('contain.text', 'New User Signup!');

        cy.xpath("//*[@data-qa='signup-name']").type('PGATS Aut');
        cy.xpath("//*[@data-qa='signup-email']").type('pgats-aut-test@email4.com');

        cy.xpath("//*[@data-qa='signup-button']").click();

        cy.xpath("//div[contains(@class, 'signup-form')]//form/p")
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Email Address already exist!');
    });

    it('CT-8: Verificar todos os produtos e a página de detalhes do produto', () => {
        cy.visit('https://automationexercise.com/');

        cy.xpath("//a[@href='/' and contains(normalize-space(), 'Home')]").should('be.visible');

        cy.xpath("//a[@href='/products']").click();

        cy.url().should('include', '/products');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' title ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'All Products');

        cy.xpath("//a[@href='/product_details/1']").click();

        cy.url().should('include', '/product_details/1');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' product-information ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'Blue Top')
            .should('contain.text', 'Category: Women > Tops')
            .should('contain.text', 'Rs. 500')
            .should('contain.text', 'Availability: In Stock')
            .should('contain.text', 'Condition: New')
            .should('contain.text', 'Brand: Polo')
    });

    it('CT-9: Pesquisar produto', () => {
        cy.visit('https://automationexercise.com/');

        cy.xpath("//a[@href='/' and contains(normalize-space(), 'Home')]").should('be.visible');

        cy.xpath("//a[@href='/products']").click();

        cy.url().should('include', '/products');

        cy.xpath("//*[@id='search_product']").type('top');

        cy.xpath("//*[@id='submit_search']").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' title ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'Searched Products');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' productinfo ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'Blue Top')
            .should('contain.text', 'Rs. 500');
    });

    it('CT-10: Verificar assinatura na página inicial', () => {
        cy.visit('https://automationexercise.com/');

        cy.xpath("//a[@href='/' and contains(normalize-space(), 'Home')]").should('be.visible');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' single-widget ')]/h2").should('exist')
            .should('be.visible')
            .should('contain.text', 'Subscription');

        cy.xpath("//*[@id='susbscribe_email']").type('pgats@email.com');

        cy.xpath("//*[@id='subscribe']").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' alert-success ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'You have been successfully subscribed!');
    });

    it('CT-15: Fazer pedido: Registre-se antes de finalizar a compra', { pageLoadTimeout: 120000 }, () => {
        cy.visit('https://automationexercise.com/');

        cy.xpath("//a[@href='/' and contains(normalize-space(), 'Home')]").should('be.visible');

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const user = {
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }),
            password: faker.internet.password({ length: 12 }),
            birthDay: faker.number.int({ min: 1, max: 28 }).toString(),
            birthMonth: faker.date.month(),
            birthYear: faker.number.int({ min: 1950, max: 2005 }).toString(),
            firstName,
            lastName,
            address: faker.location.streetAddress(),
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            mobileNumber: faker.phone.number()
        };

        cy.xpath("//a[contains(@href, '/login')]").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' signup-form ')]/h2").should('contain.text', 'New User Signup!');

        cy.xpath("//*[@data-qa='signup-name']").type(user.name);
        cy.xpath("//*[@data-qa='signup-email']").type(user.email);
        cy.xpath("//*[@data-qa='signup-button']").click();

        cy.xpath("//*[contains(@class, 'title') and contains(@class, 'text-center')]").should('contain.text', 'Enter Account Information');

        cy.xpath("//*[@id='id_gender2']").check();
        cy.xpath("//*[@data-qa='password']").type(user.password);

        // Selects e Comboboxes -> select
        cy.xpath("//*[@data-qa='days']").select(user.birthDay);
        cy.xpath("//*[@data-qa='months']").select(user.birthMonth);
        cy.xpath("//*[@data-qa='years']").select(user.birthYear);

        // Checkboxes -> check
        cy.xpath("//*[@id='newsletter']").check();
        cy.xpath("//*[@id='optin']").check();

        cy.xpath("//*[@data-qa='first_name']").type(user.firstName);
        cy.xpath("//*[@data-qa='last_name']").type(user.lastName);
        cy.xpath("//*[@data-qa='company']").type(faker.company.name());
        cy.xpath("//*[@data-qa='address']").type(user.address);
        cy.xpath("//*[@data-qa='address2']").type(faker.location.secondaryAddress());
        cy.xpath("//*[@data-qa='country']").select('Israel');
        cy.xpath("//*[@data-qa='state']").type(user.state);
        cy.xpath("//*[@data-qa='city']").type(user.city);
        cy.xpath("//*[@data-qa='zipcode']").type(user.zipcode);
        cy.xpath("//*[@data-qa='mobile_number']").type(user.mobileNumber);

        cy.xpath("//*[@data-qa='create-account']").click();

        cy.xpath("//b[contains(normalize-space(), 'Account Created!')]").should('contain.text', 'Account Created!');

        cy.xpath("//*[@data-qa='continue-button']").click();

        cy.xpath(`//*[contains(normalize-space(), 'Logged in as ${user.name}')]`).should('be.visible');

        cy.xpath("//a[@href='/products']").click();

        cy.url().should('include', '/products');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' title ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'All Products');

        cy.xpath("//a[@data-product-id='1']").first().click();

        cy.xpath("//u[normalize-space()='View Cart']").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' active ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'Shopping Cart');

        cy.xpath("//a[contains(@class, 'check_out') and contains(normalize-space(), 'Proceed To Checkout')]").click();

        cy.xpath("//*[contains(@class, 'heading') and normalize-space()='Address Details']").should('exist')
            .should('be.visible')
            .should('contain.text', 'Address Details');

        cy.xpath("//*[contains(@class, 'heading') and normalize-space()='Review Your Order']").should('exist')
            .should('be.visible')
            .should('contain.text', 'Review Your Order');

        cy.xpath("//textarea[@name='message']").type('Comentario cypress');

        cy.xpath("//a[contains(@class, 'check_out') and contains(normalize-space(), 'Place Order')]").click();

        cy.xpath("//*[@data-qa='name-on-card']").type('PGATS Aut');
        cy.xpath("//*[@data-qa='card-number']").type('1234 5678 9012 3456');
        cy.xpath("//*[@data-qa='cvc']").type('123');
        cy.xpath("//*[@data-qa='expiry-month']").type('12');
        cy.xpath("//*[@data-qa='expiry-year']").type('2030');

        cy.xpath("//*[@data-qa='pay-button']").click();

        cy.xpath("//*[@data-qa='order-placed']/b").should('exist')
            .should('be.visible')
            .should('contain.text', 'Order Placed!');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' col-sm-9 ')]/p").should('exist')
            .should('be.visible')
            .should('contain.text', 'Congratulations! Your order has been confirmed!');

        cy.xpath("//*[@data-qa='continue-button']").click();

        cy.xpath("//a[@href='/delete_account']").click();

        cy.xpath("//*[@data-qa='account-deleted']")
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Account Deleted!');
    });

    it('CT-16: Fazer pedido: Faça login antes de finalizar a compra', () => {
        cy.visit('https://automationexercise.com/');

        cy.xpath("//a[@href='/' and contains(normalize-space(), 'Home')]").should('be.visible');

        cy.xpath("//a[contains(@href, '/login')]").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' login-form ')]/h2").should('contain.text', 'Login to your account');

        cy.xpath("//*[@data-qa='login-email']").type('pgats-aut-test-1791051625531@mail.com');
        cy.xpath("//*[@data-qa='login-password']").type('123456');

        cy.xpath("//*[@data-qa='login-button']").click();

        cy.xpath("//a[@href='/logout']")
            .should('exist')
            .should('be.visible')
            .should('be.visible');

        cy.xpath("//a[@href='/products']").click();

        cy.url().should('include', '/products');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' title ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'All Products');

        cy.xpath("//a[@data-product-id='1']").first().click();

        cy.xpath("//u[normalize-space()='View Cart']").click();

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' active ')]").should('exist')
            .should('be.visible')
            .should('contain.text', 'Shopping Cart');

        cy.xpath("//a[contains(@class, 'check_out') and contains(normalize-space(), 'Proceed To Checkout')]").click();

        cy.xpath("//*[contains(@class, 'heading') and normalize-space()='Address Details']").should('exist')
            .should('be.visible')
            .should('contain.text', 'Address Details');

        cy.xpath("//*[contains(@class, 'heading') and normalize-space()='Review Your Order']").should('exist')
            .should('be.visible')
            .should('contain.text', 'Review Your Order');

        cy.xpath("//textarea[@name='message']").type('Comentario cypress');

        cy.xpath("//a[contains(@class, 'check_out') and contains(normalize-space(), 'Place Order')]").click();

        cy.xpath("//*[@data-qa='name-on-card']").type('PGATS Aut');
        cy.xpath("//*[@data-qa='card-number']").type('1234 5678 9012 3456');
        cy.xpath("//*[@data-qa='cvc']").type('123');
        cy.xpath("//*[@data-qa='expiry-month']").type('12');
        cy.xpath("//*[@data-qa='expiry-year']").type('2030');

        cy.xpath("//*[@data-qa='pay-button']").click();

        cy.xpath("//*[@data-qa='order-placed']/b").should('exist')
            .should('be.visible')
            .should('contain.text', 'Order Placed!');

        cy.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' col-sm-9 ')]/p").should('exist')
            .should('be.visible')
            .should('contain.text', 'Congratulations! Your order has been confirmed!');
    });
});

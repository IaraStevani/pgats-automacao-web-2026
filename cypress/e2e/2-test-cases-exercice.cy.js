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
        cy.get('a[href*=login]').click();

        cy.get('.signup-form > h2').should('contain.text', 'New User Signup!');

        cy.get('[data-qa="signup-name"]').type(user.name);
        cy.get('[data-qa="signup-email"]').type(user.email);
        cy.get('[data-qa="signup-button"]').click();

        cy.get('.title.text-center').should('contain.text', 'Enter Account Information');

        cy.get('#id_gender2').check();
        cy.get('[data-qa="password"]').type(user.password);

        // Selects e Comboboxes -> select
        cy.get('[data-qa="days"]').select(user.birthDay);
        cy.get('[data-qa="months"]').select(user.birthMonth);
        cy.get('[data-qa="years"]').select(user.birthYear);

        // Checkboxes -> check
        cy.get('#newsletter').check();
        cy.get('#optin').check();

        cy.get('[data-qa="first_name"]').type(user.firstName);
        cy.get('[data-qa="last_name"]').type(user.lastName);
        cy.get('[data-qa="company"]').type(faker.company.name());
        cy.get('[data-qa="address"]').type(user.address);
        cy.get('[data-qa="address2"]').type(faker.location.secondaryAddress());
        cy.get('[data-qa="country"]').select('Israel');
        cy.get('[data-qa="state"]').type(user.state);
        cy.get('[data-qa="city"]').type(user.city);
        cy.get('[data-qa="zipcode"]').type(user.zipcode);
        cy.get('[data-qa="mobile_number"]').type(user.mobileNumber);

        cy.get('[data-qa="create-account"]').click();

        cy.get('b').should('contain.text', 'Account Created!');

        cy.get('[data-qa="continue-button"]').click();

        cy.contains(`Logged in as ${user.name}`).should('be.visible');

        cy.get('a[href="/logout"]')
            .should('exist')
            .should('be.visible')
            .should('be.visible');

        cy.get('.fa-trash-o').click();

        cy.get('[data-qa="account-deleted"]')
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
        cy.get('a[href*=login]').click();

        cy.get('.login-form > h2').should('contain.text', 'Login to your account');

        cy.get('[data-qa="login-email"]').type(user.email);
        cy.get('[data-qa="login-password"]').type(user.password);

        cy.get('[data-qa="login-button"]').click();

        cy.contains(`Logged in as ${user.name}`).should('be.visible');

        cy.get('a[href="/logout"]')
            .should('exist')
            .should('be.visible')
            .should('be.visible');

        cy.get('.fa-trash-o').click();

        cy.get('[data-qa="account-deleted"]')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Account Deleted!');
    });

    it('CT-3: Login do usuário com e-mail e senha incorretos', () => {
        cy.visit('https://automationexercise.com/');
        cy.get('a[href*=login]').click();

        cy.get('.login-form > h2').should('contain.text', 'Login to your account');

        cy.get('[data-qa="login-email"]').type('pgats@email.com');
        cy.get('[data-qa="login-password"]').type('12345');

        cy.get('[data-qa="login-button"]').click();

        cy.get('.login-form > form > p')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Your email or password is incorrect!');
    });

    it('CT-4: Fazer logout do usuário', () => {
        cy.visit('https://automationexercise.com/');
        cy.get('a[href*=login]').click();

        cy.get('.login-form > h2').should('contain.text', 'Login to your account');

        cy.get('[data-qa="login-email"]').type('pgats-aut-test@email2.com');
        cy.get('[data-qa="login-password"]').type('123456');

        cy.get('[data-qa="login-button"]').click();

        cy.get('.fa-user').should('be.visible');

        cy.get('a[href="/logout"]')
            .should('exist')
            .should('be.visible')
            .should('be.visible').click();

        cy.get('.login-form > h2')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Login to your account');
    });

    it('CT-5: Cadastrar usuário com e-mail duplicado', () => {
        cy.visit('https://automationexercise.com/');
        cy.get('a[href*=login]').click();

        cy.get('.signup-form > h2').should('contain.text', 'New User Signup!');

        cy.get('[data-qa="signup-name"]').type('PGATS Aut');
        cy.get('[data-qa="signup-email"]').type('pgats-aut-test@email4.com');

        cy.get('[data-qa="signup-button"]').click();

        cy.get('.signup-form > form > p')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Email Address already exist!');
    });

    it('CT-8: Verificar todos os produtos e a página de detalhes do produto', () => {
        cy.visit('https://automationexercise.com/');

        cy.get('.fa-home').should('be.visible');

        cy.get('a[href="/products"]').click();

        cy.url().should('include', '/products');

        cy.get('.title').should('exist')
            .should('be.visible')
            .should('contain.text', 'All Products');

        cy.get('a[href="/product_details/1"]').click();

        cy.url().should('include', '/product_details/1');

        cy.get('.product-information').should('exist')
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

        cy.get('.fa-home').should('be.visible');

        cy.get('a[href="/products"]').click();

        cy.url().should('include', '/products');

        cy.get('#search_product').type('top');

        cy.get('#submit_search').click();

        cy.get('.title').should('exist')
            .should('be.visible')
            .should('contain.text', 'Searched Products');

        cy.get('.productinfo').should('exist')
            .should('be.visible')
            .should('contain.text', 'Blue Top')
            .should('contain.text', 'Rs. 500');
    });

    it('CT-10: Verificar assinatura na página inicial', () => {
        cy.visit('https://automationexercise.com/');

        cy.get('.fa-home').should('be.visible');

        cy.get('.single-widget > h2').should('exist')
            .should('be.visible')
            .should('contain.text', 'Subscription');

        cy.get('#susbscribe_email').type('pgats@email.com');

        cy.get('#subscribe').click();

        cy.get('.alert-success').should('exist')
            .should('be.visible')
            .should('contain.text', 'You have been successfully subscribed!');
    });

    it('CT-15: Fazer pedido: Registre-se antes de finalizar a compra', () => {
        cy.visit('https://automationexercise.com/');

        cy.get('.fa-home').should('be.visible');

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
        cy.get('a[href*=login]').click();

        cy.get('.signup-form > h2').should('contain.text', 'New User Signup!');

        cy.get('[data-qa="signup-name"]').type(user.name);
        cy.get('[data-qa="signup-email"]').type(user.email);
        cy.get('[data-qa="signup-button"]').click();

        cy.get('.title.text-center').should('contain.text', 'Enter Account Information');

        cy.get('#id_gender2').check();
        cy.get('[data-qa="password"]').type(user.password);

        // Selects e Comboboxes -> select
        cy.get('[data-qa="days"]').select(user.birthDay);
        cy.get('[data-qa="months"]').select(user.birthMonth);
        cy.get('[data-qa="years"]').select(user.birthYear);

        // Checkboxes -> check
        cy.get('#newsletter').check();
        cy.get('#optin').check();

        cy.get('[data-qa="first_name"]').type(user.firstName);
        cy.get('[data-qa="last_name"]').type(user.lastName);
        cy.get('[data-qa="company"]').type(faker.company.name());
        cy.get('[data-qa="address"]').type(user.address);
        cy.get('[data-qa="address2"]').type(faker.location.secondaryAddress());
        cy.get('[data-qa="country"]').select('Israel');
        cy.get('[data-qa="state"]').type(user.state);
        cy.get('[data-qa="city"]').type(user.city);
        cy.get('[data-qa="zipcode"]').type(user.zipcode);
        cy.get('[data-qa="mobile_number"]').type(user.mobileNumber);

        cy.get('[data-qa="create-account"]').click();

        cy.get('b').should('contain.text', 'Account Created!');

        cy.get('[data-qa="continue-button"]').click();

        cy.contains(`Logged in as ${user.name}`).should('be.visible');

        cy.get('a[href="/products"]').click();

        cy.url().should('include', '/products');

        cy.get('.title').should('exist')
            .should('be.visible')
            .should('contain.text', 'All Products');

        cy.get('a[data-product-id="1"]').first().click();

        cy.get('u').click();

        cy.get('.active').should('exist')
            .should('be.visible')
            .should('contain.text', 'Shopping Cart');

        cy.get('.col-sm-6 > .btn').click();

        cy.get(':nth-child(2) > .heading').should('exist')
            .should('be.visible')
            .should('contain.text', 'Address Details');

        cy.get(':nth-child(4) > .heading').should('exist')
            .should('be.visible')
            .should('contain.text', 'Review Your Order');

        cy.get('.form-control').type('Comentario cypress');

        cy.get('.btn-default.check_out').click();

        cy.get('[data-qa="name-on-card"]').type('PGATS Aut');
        cy.get('[data-qa="card-number"]').type('1234 5678 9012 3456');
        cy.get('[data-qa="cvc"]').type('123');
        cy.get('[data-qa="expiry-month"]').type('12');
        cy.get('[data-qa="expiry-year"]').type('2030');

        cy.get('[data-qa="pay-button"]').click();

        cy.get('[data-qa="order-placed"] > b').should('exist')
            .should('be.visible')
            .should('contain.text', 'Order Placed!');

        cy.get('.col-sm-9 > p').should('exist')
            .should('be.visible')
            .should('contain.text', 'Congratulations! Your order has been confirmed!');

        cy.get('[data-qa="continue-button"]').click();

        cy.get('.fa-trash-o').click();

        cy.get('[data-qa="account-deleted"]')
            .should('exist')
            .should('be.visible')
            .should('contain.text', 'Account Deleted!');
    });

    it('CT-16: Fazer pedido: Faça login antes de finalizar a compra', () => {
        cy.visit('https://automationexercise.com/');

        cy.get('.fa-home').should('be.visible');

        cy.get('a[href*=login]').click();

        cy.get('.login-form > h2').should('contain.text', 'Login to your account');

        cy.get('[data-qa="login-email"]').type('pgats-aut-test-1791051625531@mail.com');
        cy.get('[data-qa="login-password"]').type('123456');

        cy.get('[data-qa="login-button"]').click();

        cy.get('a[href="/logout"]')
            .should('exist')
            .should('be.visible')
            .should('be.visible');

        cy.get('a[href="/products"]').click();

        cy.url().should('include', '/products');

        cy.get('.title').should('exist')
            .should('be.visible')
            .should('contain.text', 'All Products');

        cy.get('a[data-product-id="1"]').first().click();

        cy.get('u').click();

        cy.get('.active').should('exist')
            .should('be.visible')
            .should('contain.text', 'Shopping Cart');

        cy.get('.col-sm-6 > .btn').click();

        cy.get(':nth-child(2) > .heading').should('exist')
            .should('be.visible')
            .should('contain.text', 'Address Details');

        cy.get(':nth-child(4) > .heading').should('exist')
            .should('be.visible')
            .should('contain.text', 'Review Your Order');

        cy.get('.form-control').type('Comentario cypress');

        cy.get('.btn-default.check_out').click();

        cy.get('[data-qa="name-on-card"]').type('PGATS Aut');
        cy.get('[data-qa="card-number"]').type('1234 5678 9012 3456');
        cy.get('[data-qa="cvc"]').type('123');
        cy.get('[data-qa="expiry-month"]').type('12');
        cy.get('[data-qa="expiry-year"]').type('2030');

        cy.get('[data-qa="pay-button"]').click();

        cy.get('[data-qa="order-placed"] > b').should('exist')
            .should('be.visible')
            .should('contain.text', 'Order Placed!');

        cy.get('.col-sm-9 > p').should('exist')
            .should('be.visible')
            .should('contain.text', 'Congratulations! Your order has been confirmed!');
    });
});
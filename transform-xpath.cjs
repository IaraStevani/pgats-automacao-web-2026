const fs = require('fs');
const path = 'cypress/e2e/2.2-test-cases-exercice-xpath.cy.js';
let source = fs.readFileSync(path, 'utf8');

const special = {
  'a[href*=login]': "//a[contains(@href, '/login')]",
  ':nth-child(2) > .heading': "//*[contains(@class, 'heading') and normalize-space()='Address Details']",
  ':nth-child(4) > .heading': "//*[contains(@class, 'heading') and normalize-space()='Review Your Order']",
  '.col-sm-6 > .btn': "//a[contains(@class, 'check_out') and contains(normalize-space(), 'Proceed To Checkout')]",
  '.btn-default.check_out': "//a[contains(@class, 'check_out') and contains(normalize-space(), 'Place Order')]",
  '.form-control': "//textarea[@name='message']",
  '.fa-trash-o': "//a[@href='/delete_account']",
  '.fa-home': "//a[@href='/' and contains(normalize-space(), 'Home')]",
  '.fa-user': "//a[contains(normalize-space(), 'Logged in as')]",
  '.active': "//*[contains(concat(' ', normalize-space(@class), ' '), ' active ')]",
  '[data-qa="order-placed"] > b': "//*[@data-qa='order-placed']/b",
  'u': "//u[normalize-space()='View Cart']",
  'b': "//b[contains(normalize-space(), 'Account Created!')]"
};

function toXPath(selector) {
  if (special[selector]) return special[selector];
  let match = selector.match(/^\[([^=]+)="([^"]+)"\]$/);
  if (match) return `//*[@${match[1]}='${match[2]}']`;
  match = selector.match(/^#(.+)$/);
  if (match) return `//*[@id='${match[1]}']`;
  match = selector.match(/^(\w+)\[([^=*]+)="([^"]+)"\](?: > (\w+))?$/);
  if (match) return `//${match[1]}[@${match[2]}='${match[3]}']${match[4] ? `/${match[4]}` : ''}`;
  match = selector.match(/^\.([\w-]+) > (\w+)$/);
  if (match) return `//*[contains(concat(' ', normalize-space(@class), ' '), ' ${match[1]} ')]/${match[2]}`;
  match = selector.match(/^\.([\w-]+) > form > (\w+)$/);
  if (match) return `//*[contains(concat(' ', normalize-space(@class), ' '), ' ${match[1]} ')]//form/${match[2]}`;
  match = selector.match(/^\.([\w-]+)$/);
  if (match) return `//*[contains(concat(' ', normalize-space(@class), ' '), ' ${match[1]} ')]`;
  match = selector.match(/^\.([\w-]+)\.([\w-]+)$/);
  if (match) return `//*[contains(@class, '${match[1]}') and contains(@class, '${match[2]}')]`;
  throw new Error(`Seletor sem conversão: ${selector}`);
}

source = source.replace(/cy\.get\('([^']+)'\)/g, (_, selector) => `cy.xpath("${toXPath(selector)}")`);
source = source.replace(/cy\.contains\(`Logged in as \$\{user\.name\}`\)/g,
  "cy.xpath(`//*[contains(normalize-space(), 'Logged in as ${user.name}')]`)");
fs.writeFileSync(path, source, 'utf8');

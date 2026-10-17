const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Caso o teste falhar, executa o teste novamente
  //  retries: {
  //    runMode: 2, // iterativo (abre navegador) / headed / ci
  //    openMode: 0,// headless
  //  },

  reporter: "cypress-mochawesome-reporter",
  e2e: {
    baseUrl: 'https://automationexercise.com/',
    watchForFileChanges: false,
    viewportWidth: 375,
    viewportHeight: 750,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);    
      // implement node event listeners here
    },
  },
});

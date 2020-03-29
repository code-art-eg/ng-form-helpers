module.exports = {
  packages: {
    '../dist/ng-form-helpers': {
      ignorableDeepImportMatchers: [
        /\/globalize\/dist\/globalize$/
      ]
    },
    '@code-art/angular-globalize': {
      ignorableDeepImportMatchers: [
        /\/globalize\/dist\/globalize$/
      ]
    }
  }
}

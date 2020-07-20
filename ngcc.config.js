module.exports = {
  packages: {
    '../dist/ng-form-helpers': {
      ignorableDeepImportMatchers: [
        /\/globalize\/dist\/globalize$/
      ]
    },
    '@code-art-eg/angular-globalize': {
      ignorableDeepImportMatchers: [
        /\/globalize\/dist\/globalize$/
      ]
    }
  }
}

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'detectBrowsers'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-detect-browsers',
      'karma-jasmine-html-reporter',
      'karma-coverage-istanbul-reporter',
      '@angular-devkit/build-angular/plugins/karma'
    ],
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 80,
        functions: 80
      }
    },
    detectBrowsers: {
      // enable/disable, default is true
      enabled: true,

      // enable/disable phantomjs support, default is true
      usePhantomJS: false,

      // use headless mode, for browsers that support it, default is false
      preferHeadless: true,
    },
    singleRun: true
  });
};

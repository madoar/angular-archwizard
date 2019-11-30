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
      'karma-safari-launcher',
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
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      ChromiumHeadlessNoSandbox: {
        base: 'ChromiumHeadless',
        flags: ['--no-sandbox']
      }
    },
    detectBrowsers: {
      // enable/disable, default is true
      enabled: true,

      // enable/disable phantomjs support, default is true
      usePhantomJS: false,

      // use headless mode, for browsers that support it, default is false
      preferHeadless: true,

      postDetection: function (availableBrowsers) {
        if (availableBrowsers.includes("ChromeHeadless")) {
          const index = availableBrowsers.indexOf("ChromeHeadless");

          availableBrowsers.splice(index, 1);

          availableBrowsers.push("ChromeHeadlessNoSandbox");
        }

        if (availableBrowsers.includes("ChromiumHeadless")) {
          const index = availableBrowsers.indexOf("ChromiumHeadless");

          availableBrowsers.splice(index, 1);

          availableBrowsers.push("ChromiumHeadlessNoSandbox");
        }

        return availableBrowsers;
      }
    },
    singleRun: true
  });
};

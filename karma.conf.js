// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'detectBrowsers'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-safari-launcher'),
      require('karma-detect-browsers'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' },
      ],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 80,
        functions: 80,
      },
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
      ChromiumHeadlessNoSandbox: {
        base: 'ChromiumHeadless',
        flags: ['--no-sandbox'],
      },
    },
    detectBrowsers: {
      // enable/disable, default is true
      enabled: true,

      // enable/disable phantomjs support, default is true
      usePhantomJS: false,

      // use headless mode, for browsers that support it, default is false
      preferHeadless: true,

      postDetection: function (availableBrowsers) {
        // remove IE if detected
        if (availableBrowsers.includes('IE')) {
          const index = availableBrowsers.indexOf('IE');

          availableBrowsers.splice(index, 1);
        }

        // ChromeHeadless -> ChromeHeadlessNoSandbox
        if (availableBrowsers.includes('ChromeHeadless')) {
          const index = availableBrowsers.indexOf('ChromeHeadless');

          availableBrowsers[index] = 'ChromeHeadlessNoSandbox';
        }

        // ChromiumHeadless -> ChromiumHeadlessNoSandbox
        if (availableBrowsers.includes('ChromiumHeadless')) {
          const index = availableBrowsers.indexOf('ChromiumHeadless');

          availableBrowsers[index] = 'ChromiumHeadlessNoSandbox';
        }

        return availableBrowsers;
      },
    },
    singleRun: true,
  });
};

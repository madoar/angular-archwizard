// Karma configuration for Unit testing

const path = require('path');

module.exports = function (config) {

  const configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-spec-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require("istanbul-instrumenter-loader")
    ],

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: './karma-shim.js',
        watched: false
      }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './karma-shim.js': ['webpack', 'sourcemap']
    },

    // webpack
    webpack: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts/,
            loaders: ['ts-loader', 'angular2-template-loader'],
            exclude: /node_modules/
          },
          {
            test: /\.(ts|js)$/,
            loaders: ['angular-router-loader'],
            exclude: /node_modules/
          },
          {
            enforce: 'post',
            test: /\.ts/,
            use: [
              {
                loader: 'istanbul-instrumenter-loader',
                options: {esModules: true}
              }
            ],
            exclude: [/\.spec.ts/, /node_modules/]
          },
          {
            test: /\.html$/,
            loader: 'raw-loader'
          },
          {
            test: /\.less$/,
            loaders: ['to-string-loader', 'css-loader', 'less-loader']
          },
          {
            test: /\.css$/,
            loaders: ['to-string-loader', 'css-loader']
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
          },
        ],
        exprContextCritical: false
      },
      performance: {hints: false}
    },

    webpackServer: {
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      dir: path.join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true,
      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {

        // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html'
        }

      }
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  };

  config.set(configuration);
};

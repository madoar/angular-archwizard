var gulp = require('gulp');
var inlineResources = require('./scripts/gulp/inline-resources');
var sass = require('gulp-sass');


gulp.task('copy-and-inline-resource', copyHtml);

function copyHtml() {
  gulp.src('src/components/**/*.html')
    .pipe(gulp.dest('./dist/components')).on('end', copyAssets);
}

function copyAssets() {
  gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./dist/assets')).on('end', copyCss);
}

function copyCss() {
  gulp.src('./src/components/**/*.css')
    .pipe(gulp.dest('./dist/components')).on('end', copyLess);
}

function copyLess() {
  gulp.src('./src/components/**/*.less')
    .pipe(gulp.dest('./dist/components')).on('end', inlineResource);
}

function inlineResource() {
  inlineResources('./dist/components');
}

gulp.task('default', ['copy-and-inline-resource']);

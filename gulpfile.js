var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');

var inlineResources = require('./scripts/gulp/inline-resources');

gulp.task('copy-and-inline-resources', copyHtml);

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
    .pipe(less())
    .pipe(gulp.dest('./dist/components')).on('end', inlineResource);
}

function inlineResource() {
  inlineResources('./dist/components');
}

gulp.task('cleanup-unused-resources', [deleteHtml, deleteCss, deleteLess]);

function deleteHtml() {
  return gulp.src('./dist/components/**/*.html', { read: false })
    .pipe(clean());
}

function deleteCss() {
  return gulp.src('./dist/components/**/*.css', { read: false })
    .pipe(clean());
}

function deleteLess() {
  return gulp.src('./dist/components/**/*.less', { read: false })
    .pipe(clean());
}

gulp.task('default', ['copy-and-inline-resources', 'cleanup-unused-resources']);

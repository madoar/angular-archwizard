import gulp from 'gulp';
import ngc from 'gulp-ngc';
import less from 'gulp-less';
import inline from 'gulp-inline-ng2-template';

import rimraf from 'rimraf';

import fs from 'fs';

function lessProcessor(path, ext, file, cb) {
  if (ext[0] === ".less") {
    return cb(null, fs.readFileSync(path.substring(0, path.length - ext[0].length) + ".css"));
  } else {
    return cb(null, file);
  }
}

/**
 * delete the tmp and dist folders
 */
gulp.task('cleanup', (cb) => {
  rimraf.sync('tmp');
  rimraf('dist', cb);
});

/**
 * move all files from the src folder to the tmp folder
 */
gulp.task('move-to-tmp', ['cleanup'], () => {
  return gulp.src(["src/**/*"])
    .pipe(gulp.dest('tmp'));
});

/**
 * compile all less files to css files in the tmp folder
 */
gulp.task('less', ['cleanup'], () => {
  return gulp.src('./src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('tmp'));
});

/**
 * inline both the html and stylesheets inside the angular 2 typescript template files inside the tmp folder
 */
gulp.task('inline', ['less', 'move-to-tmp'], () => {
  return gulp.src(['tmp/**/*.ts'])
    .pipe(inline({
      useRelativePaths: true,
      styleProcessor: lessProcessor
    }))
    .pipe(gulp.dest('tmp'));
});

/**
 * compile the typescript files from the tmp folder to javascript files and save the resulting files
 * inside the dist folder
 */
gulp.task('compile', ['inline'], () => {
  return ngc('tmp/tsconfig.aot.json');
});

gulp.task('default', ['cleanup', 'move-to-tmp', 'less', 'inline', 'compile']);

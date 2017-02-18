import gulp from 'gulp';
import ngc from 'gulp-ngc';
import less from 'gulp-less';
import inline from 'gulp-inline-ng2-template';

import fs from 'fs';

function lessProcessor(path, ext, file, cb) {
  if (ext[0] == ".less") {
    cb(null, fs.readFileSync(path.substring(0, path.length - ext[0].length) + ".css"));
  } else {
    cb(null, file);
  }
}

gulp.task('move-to-tmp', () => {
  return gulp.src(["src/**/*"])
    .pipe(gulp.dest('tmp'));
});

gulp.task('less', () => {
  return gulp.src('./src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('tmp'));
});

gulp.task('inline', ['less', 'move-to-tmp'], () => {
  return gulp.src(['tmp/**/*.ts'])
    .pipe(inline({
      useRelativePaths: true,
      styleProcessor: lessProcessor
    }))
    .pipe(gulp.dest('tmp'));
});

gulp.task('compile', ['inline'], () => {
  return ngc('tmp/tsconfig.aot.json');
});

gulp.task('default', ['move-to-tmp', 'less', 'compile']);

const gulp = require('gulp');

gulp.task('copy-static', function () {
  return gulp.src('./src/static/**')
    .pipe(gulp.dest('./dist/static'));
});

gulp.task('copy-hbs', function () {
  return gulp.src('./src/**/*.hbs')
    .pipe(gulp.dest('./dist'));
});
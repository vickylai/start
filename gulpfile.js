var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
critical = require('critical').stream;

gulp.task("default", function () {
// Process sass to minified css & autoprefix
gulp.src('sass/*.sass')
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(autoprefixer())
  .pipe(gulp.dest('css/'));
});

gulp.task("watch", function () {
// Process sass to minified css & autoprefix
gulp.watch('sass/*.sass', function () {
  gulp.src('sass/*.sass')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('css/'));
});
});

// Generate, Minify, & Inline Critical-path CSS
gulp.task('critical', function () {
  return gulp.src('index.html')
      .pipe(critical({base: '/', inline: true, minify:true, css: ['css/style.css']}))
      .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
      .pipe(gulp.dest('critical/'));
});
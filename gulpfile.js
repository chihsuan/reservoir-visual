var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./index_edit.html')
    .pipe(minifyHTML(opts))
    .pipe(rename("./index.html"))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch('./index_edit.html', ['minify-html']);
});

gulp.task('default', ['minify-html']);

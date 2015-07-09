/*
 *
 *  Web Starter Kit with own changes
 *
 */

'use strict';

// Include gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var critical = require('critical');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fs = require('fs');
var path = require('path');
var packageJson = require('./package.json');

// Optimize images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
  return gulp.src([
    'app/*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {

  var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];



  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.changed('.tmp/styles', {extension: '*.css'}))
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'styles'}));
})

// Concatenate and minify JavaScript
gulp.task('scripts', function () {
  var sources = ['./app/scripts/main.js'];
  return gulp.src(sources)
    .pipe($.concat('main.min.js'))
    .pipe($.uglify({preserveComments: 'some'}))
    // Output files
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.size({title: 'scripts'}));
});

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: '{.tmp,dist}'});

  return gulp.src('dist/**/**/*.html')

    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});


//Create critical css
gulp.task('critical', function () {
  critical.generateInline({
    base: 'dist/',
    src: 'index.html',
    width: 320,
    height: 480,
    htmlTarget: 'index.html'
  });
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Build and serve the output from the dist build
gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'Montana',
    server: 'dist'
  });

  gulp.watch(['app/**/*.html'], ['htmlwatch', reload]);
  gulp.watch(['app/styles/**/*.{scss, css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['scripts']);
  gulp.watch(['app/images/**/*'], reload);

});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
  runSequence(
    'styles',
    'copy',
    'critical',
    ['images', 'scripts'],
    'html',
    cb);
});

//When html file is udpated this task runs
gulp.task('htmlwatch', function (cb) {
  runSequence(
    'styles',
    'copy',
    'critical',
    'html',
    cb);
});

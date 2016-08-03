/**
 *
 *
 *  This has been converted into my framework from WSK
 *
 */

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';
import autoprefixer from 'autoprefixer';
import critical from 'critical';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('jshint', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', () => {
  return gulp.src('app/images/**/*.{svg,png,jpg,gif}')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', () => {
  return gulp.src([
    'app/*',
    'app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess',
    '!tmp-'
  ], {
    dot: true
  })
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Compile and automatically prefix stylesheets, postCSS can be reviewed for less than modern browser fall backs
gulp.task('styles', () => {
  // For best performance, don't add Sass partials to `gulp.src` just globby glob it
  return gulp.src([
    'app/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.changed('.tmp/styles', {extension: '.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'compressed'
    }).on('error', $.sass.logError))
    .pipe($.postcss([autoprefixer()]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'styles'}));
});

// Concatenate and minify JavaScript
gulp.task('scripts', () => {
  return gulp.src(['./app/scripts/main.js'])
    .pipe($.concat('main.min.js'))
    .pipe($.uglify({preserveComments: 'some'}))
    // Output files
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.size({title: 'scripts'}));
});

// Scan your HTML for assets & optimize it
gulp.task('html', () => {
  return gulp.src('dist/**/*.html')
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

//Create critical CSS, views site in resolution and spits out only CSS from that view. Decreases visual render time of site
gulp.task('critical', () => {
  return gulp.src('dist/**/*.html')
  .pipe(critical.stream({
    inline: true,
    minify: true,
    base: 'dist',
    css: 'dist/styles/styles.css',
    width: 800,
    height: 600,
    ignore: ['@font-face', '/url\(/']
  }))
  .pipe(gulp.dest('dist'));
});

// Clean output directory (dist/temp)
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}, cb));

// Watch files for changes & reload
gulp.task('serve', cb => {
  runSequence('default');
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch('app/scripts/*.js', ['jshint', 'scripts']);
  gulp.watch('app/styles/**/*.scss', ['default']);
  gulp.watch('app/*.html', ['default']);
  gulp.watch('app/images/**/*.{svg,png,jpg,gif}', ['images']);
});

// Build production files, the default task
gulp.task('default', ['clean'], cb => {
  runSequence(
    'styles',
    'copy',
    'critical',
    ['jshint', 'scripts', 'html', 'images'],
    cb
  );
});

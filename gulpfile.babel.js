/*

  Architecture structure for SCSS with context and content descriptions for how to use specific pieces and vernacular

*/

import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import autoprefixer from 'autoprefixer';

const $ = gulpLoadPlugins();

// Optimize images, only looking at the main four. SVG, PNG, JPG and GIF. SVGs can be optimized further by the designer by reducing paths, etc
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

//Run Sass Lint before compiling
//Checks setup of Sass files and confirms they match the standards
gulp.task('style-lint', () => {
  return gulp.src('app/**/*.scss')
    .pipe($.stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ],
      debug: true,
      syntax: 'scss'
    }))
});

// Compile and automatically prefix stylesheets, postCSS can be reviewed for less than modern browser fall backs
gulp.task('styles', () => {
  // For best performance, don't add Sass partials to `gulp.src` just globby glob it
  //Using postCSS cause it's p cool, right now just using autoprefixer after Sass is compiled
  return gulp.src([
    'app/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.changed('.tmp/styles', {extension: '.css'}))
    //Source maps work in Chrome to let you see what partial is being fetched
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
    .pipe($.if('*.html', $.htmlmin()))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory (dist/temp)
gulp.task('clean', cb =>
  del(['.tmp', 'dist/*', '!dist/.git'],
  {dot: true}, cb));

// Watch files for changes & reload
gulp.task('serve', () => {
  runSequence('default');
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  //Each watch task is specific to how to control the direction of tasks
  gulp.watch('app/scripts/*.js', ['scripts']);
  gulp.watch('app/styles/**/*.scss', ['styles', 'style-lint']);
  //Watch index for any changes to landing page and run scripts
  gulp.watch('app/index.html', ['default']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/images/**/*.{svg,png,jpg,gif}', ['images']);
});

// Build production files, the default task
gulp.task('default', ['clean'], () => {
  runSequence(
    'styles',
    'copy',
    ['scripts', 'html', 'images']
  );
});

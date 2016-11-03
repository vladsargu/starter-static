/**
 * Load Gulp and Gulp-adjacent dependencies
 */
var gulp           = require('gulp'),
    gutil          = require('gulp-util'),
    concat         = require('gulp-concat'),
    connect        = require('gulp-connect'),
    cssnano        = require('gulp-cssnano'),
    imagemin       = require('gulp-imagemin'),
    mainBowerFiles = require('main-bower-files'),
    sass           = require('gulp-sass'),
    sassAssetFuncs = require('node-sass-asset-functions'),
    sassglob       = require('gulp-sass-glob')

/**
 * Define paths
 */
var src  = 'app/assets/',
    dest = 'public/assets/'

var paths = {
  src: {
    sass:   src + 'sass',
    fonts:  src + 'fonts/**/*',
    images: src + 'images/**/*',
    js:     src + 'javascripts/**/*',
  },
  dest: {
    css:    dest + 'css/',
    fonts:  dest + 'fonts/',
    images: dest + 'img/',
    js:     dest + 'js/',
  }
}

/**
 * CSS tasks
 */
gulp.task('css', function() {
  gulp.src(paths.src.sass + '/*.scss')
    .pipe(sassglob())
    .pipe(sass({
      functions: sassAssetFuncs({
        'images_path': paths.dest.images,
        'http_images_path': '/assets/img/'
      }),
      includePaths: [
        './vendor/bower_components',
        './vendor/bower_components/breakpoint-sass/stylesheets'
      ]
    }).on('error', sass.logError))
    .pipe(cssnano({
      autoprefixer: {
        browsers: ['last 2 versions'],
        cascade: false
      },
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(connect.reload())
})

/**
 * Images
 */
gulp.task('images', function () {
  gulp.src(paths.src.images)
    .pipe(imagemin({
      progressive: true,
      multipass: true
    }))
    .pipe(gulp.dest(paths.dest.images))
    .pipe(connect.reload())
})

/**
 * Serve requests
 */
gulp.task('serve', function () {
  connect.server({
    root: 'public',
    livereload: true,
  })
})

/**
 * Watch filesystem for changes
 */
gulp.task('watcher', function () {
  gulp.watch(paths.src.sass + '/**/*', ['css'])
  gulp.watch(paths.src.images,         ['images'])
})

/**
 * Set up default task
 */
gulp.task('default', [
  'images',
  'css'
])

/**
 * Set up watch task
 */
gulp.task('watch', [
  'default',
  'watcher',
  'serve'
])

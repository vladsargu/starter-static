var gulp  = require('gulp');
var gutil = require('gulp-util');

var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var compass    = require('gulp-compass');
var imagemin   = require('gulp-imagemin');
var minifyCSS  = require('gulp-minify-css');
var livereload = require('gulp-livereload');

var dev = 'app/assets/';
var pub = 'public/assets/';

var paths = {
	dev: {
		fonts:       dev + 'fonts/**',
		images:      dev + 'images/*',
		javascripts: dev + 'javascripts/*',
		sass:        dev + 'sass',
		sass_all:   [dev + 'sass/*', dev + 'sass/**']
	},
	pub: {
		css:         pub + 'css/',
		fonts:       pub + 'fonts/',
		images:      pub + 'img/',
		javascripts: pub + 'js/'
	}
};

gulp.task('css', function() {
	gulp.src(paths.dev.sass + '/*.scss')
		.pipe(compass({
			sass:       paths.dev.sass,
			css:        paths.pub.css,
			image:      paths.pub.images,
			font:       paths.pub.fonts,
			require: [
				'susy',
				'rgbapng',
				'breakpoint',
				'sass-globbing',
				'compass-normalize'
			],
			bundle_exec: true
		}))
		.on('error', gutil.log)
		.pipe(minifyCSS())
		.pipe(gulp.dest(paths.pub.css));
});

gulp.task('images', function () {
	gulp.src(paths.dev.images)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.pub.images));
});

gulp.task('watch', function() {
	gulp.watch(paths.dev.sass_all, ['css']);
	gulp.watch(paths.dev.images, ['images']);

	gulp.watch(pub + '**').on('change', function(file) {
		livereload().changed(file.path);
	});
});

gulp.task('default', ['css', 'images']);

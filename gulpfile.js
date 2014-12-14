/// <vs AfterBuild='default' Clean='clean' />
var gulp = require('gulp');
var trayballoon = require('trayballoon');

var del			= require('del');
var tslint 		= require('gulp-tslint');
var concat 		= require('gulp-concat');
var uglify 		= require('gulp-uglify');
var rename 		= require('gulp-rename');
var ts			= require('gulp-typescript');
var typedoc		= require('gulp-typedoc');
var eventStream = require('event-stream');
var plumber     = require('gulp-plumber');
var karma 		= require('karma').server;
var runSequence = require('run-sequence');


var onError = function(err) {
    trayballoon({
        text: err.message,
        timeout: 5000,
        icon: 'evilduck.ico'
    });
};

gulp.task('clean', function(done) {
	del(['dist', 'coverage'], done);
});

gulp.task('lint', function() {
	return gulp
		.src(['src/*.ts'])
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
});

gulp.task('compile', function() {
	var tsResult = gulp
		.src(['src/*.ts'])
        .pipe(plumber({
            errorHandler: onError
        }))
		.pipe(ts({
			declarationFiles: 	true,
			noExternalResolve: 	false
		}));

	return eventStream.merge(
		tsResult.dts.pipe(gulp.dest('dist/dts')),
		tsResult.js.pipe(gulp.dest('dist/js/src')));
});

gulp.task('compile-test', function() {
	var tsResult = gulp
		.src(['test/**/*.spec.ts'])
        .pipe(plumber({
            errorHandler: onError
        }))
		.pipe(ts({
			declarationFiles: false,
			noExternalResolve: false
		}));

	return tsResult.js.pipe(gulp.dest('test'));
});

gulp.task('minify', function() {
	return gulp
		.src(['dist/js/src/*.js'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename('angular-event-distpacher.min.js'))
		.pipe(gulp.dest('dist/js'));

});

gulp.task('karma', function(done) {
	karma.start({
		configFile: __dirname + '/test/test.conf.js',
		singleRun: true
	}, done);
});

gulp.task('karma-watch', function(done){
	karma.start({
		configFile: __dirname + '/test/test.conf.js',
		singleRun: false
	}, done);
});

gulp.task('info', function() {
    trayballoon({
        text: 'Build successful',
        timeout: 20000,
        icon: 'evilduck.ico'
    });
});

gulp.task('default', function(done) {
	runSequence('clean', 'lint', ['compile', 'compile-test'], 'minify', 'karma', 'info', done);
});

gulp.task('fast', function(done) {
    runSequence('clean', ['compile', 'compile-test'], 'karma', 'info', done);
});

gulp.task('watch', function() {
    gulp.watch(['src/**/*.ts', 'test/src/**/*.ts'], ['fast']);
});
/// <vs AfterBuild='default' Clean='clean' />
var gulp = require('gulp');

var del			= require('del');
var tslint 		= require('gulp-tslint');
var concat 		= require('gulp-concat');
var uglify 		= require('gulp-uglify');
var rename 		= require('gulp-rename');
var ts			= require('gulp-typescript');
var typedoc		= require('gulp-typedoc');
var eventStream	= require('event-stream');
var karma 		= require('karma').server;
var runSequence = require('run-sequence');

gulp.task('clean', function(done) {
	del(['dist', 'doc', 'coverage'], done);
});

gulp.task('lint', function() {
	return gulp
		.src(['src/*.ts'])
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
});

gulp.task('doc', function() {
	return gulp
		.src(['src/*.ts'])
		.pipe(typedoc({
			module: 'commonjs',
			out: './doc',
			name: 'Angular Event Dispatcher',
			target: 'es5'
		}));
});

gulp.task('compile', function() {
	var tsResult = gulp
		.src(['src/*.ts'])
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

gulp.task('default', function(done) {
	runSequence('clean', ['lint', 'doc'], ['compile', 'compile-test'], 'minify', 'karma', done);
});
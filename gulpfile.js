'use strict'

var gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    mozjpeg = require('imagemin-mozjpeg'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    svgSprite = require('gulp-svg-sprite'),
    autoprefixer = require('gulp-autoprefixer');

// Работа с Pug
gulp.task('pug', function() {
    return gulp.src('src/pug/index.pug')
        .pipe(gp.plumber())
        .pipe(gp.pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
        .on('end', browserSync.reload);
});

// Работа с Sass
gulp.task('sass', function() {
    return gulp.src('src/static/sass/main.sass')
        .pipe(sourcemaps.init())
        .pipe(gp.plumber())
        .pipe(gp.sass({
            'include css': true
        }))
        .pipe(gp.autoprefixer({
            browsers: ['last 10 versions']
        }))

    .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gp.csso())
        .pipe(sourcemaps.write())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest('build/static/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// SVG Sprite
gulp.task('svg', () => {
    return gulp.src('./src/static/img/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest('./build/static/img/svg/'));
});

// Browsersync
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'build'
        }
    });
});

// Работа с Img
gulp.task('img:build', function() {
    return gulp.src('src/static/img/**/*.{jpg, png, webp, gif}')
        .pipe(cache(imagemin([
            mozjpeg({
                quality: 65
            })
        ])))
        .pipe(gulp.dest('build/static/img/'));
});


// Работа с JS
gulp.task('scripts:lib', function() {
    return gulp.src([
            // Библиотеки
            // 'node_modules/jquery/dist/jquery.min.js',
            // 'node_modules/slick-carousel/slick/slick.min.js',
            // 'src/static/js/smooth-scroll.polyfills.min.js',
            // 'build/static/libs/magnific/jquery.magnific-popup.min.js',
            // 'build/static/libs/bxslider/jquery.bxslider.min.js',
            // 'build/static/libs/maskedinput/maskedinput.js',
            // 'build/static/libs/validate/jquery.validate.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/static/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('scripts', function() {
    return gulp.src('src/static/js/common.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/static/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('watch', function() {
    gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
    gulp.watch('src/static/sass/*.sass', gulp.series('sass'));
    gulp.watch('src/static/js/common.js', gulp.series('scripts'))
});

gulp.task('default', gulp.series(
    gulp.parallel('pug', 'sass', 'scripts:lib', 'scripts'),
    gulp.parallel('watch', 'serve')
));

gulp.task('clear', function() {
    return cache.clearAll();
})
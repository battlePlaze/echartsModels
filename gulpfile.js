var gulp = require('gulp');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var cache = require('gulp-cached');
var rename = require('gulp-rename');
var pngquant = require('imagemin-pngquant');
var concat=require('gulp-concat')

gulp.task('image',function(){
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist'));
});
gulp.task('css', function() {
    gulp.src('./src/styles/*.css')
        .pipe(gulp.dest('dist'))
        .pipe(cleancss({
            advanced: false,
            compatibility: 'ie8',
            keepBreaks: true,
            keepSpecialComments: '*'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});
gulp.task('script',function(){
    gulp.src(['./src/javascript/raphael.min.js','./src/javascript/sxcolormap.js'])
        .pipe(concat('sxcolormap.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist'));


    gulp.src(['./src/javascript/svg.js'])
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist'));



});
gulp.task('default',['image','css','script']);

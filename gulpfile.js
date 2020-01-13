const gulp = require('gulp'); 
const useref = require('gulp-useref');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const jshint = require('gulp-jshint'); 
const uglify = require('gulp-uglify');
const htmlClean = require('gulp-htmlclean');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
const del = require('del');
const cache = require('gulp-cache');
const fileinclude = require('gulp-file-include');
const webserver = require('gulp-webserver');
// const rename = require('gulp-rename');

// Delete temp directory
function cleanTemp(cb){
    cb();
    return del.sync('./dist');
    
}

// Delete dist directory
function cleanDist(cb){
    cb();
    return del.sync('./temp');    
}

// development server
function webServer(){
    return gulp.src('./temp')
    .pipe(webserver({
        livereload: true,         
        open: true,
        port:3000
      }));
}

// optimize images
function images(){
    return gulp
    .src("./app/images/**/*")
    .pipe(newer("./dist/images/"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./dist/images/"));
}

// javascript code lint 
function scriptsLint(){
    return gulp.src('./app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}
 

// Transpile, concatenate and minify HTML, CSS and JS
function minifyCode(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js',uglify()))
        .pipe(gulpIf('*.css',cssnano()))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
          }))
        .pipe(htmlClean({
            protect: /<\!--%fooTemplate\b.*?%-->/g,
            edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
          }))
        .pipe(gulp.dest('dist/'))
}

function copyFiles(cb){
gulp.src('./app/css/*.css')
.pipe(gulp.dest('./temp/css/'));

gulp.src('./app/images/*')
.pipe(gulp.dest('./temp/images/'));

gulp.src('./app/js/*.js')
.pipe(gulp.dest('./temp/js/'));

gulp.src('./app/*.html')
.pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  }))
.pipe(gulp.dest('./temp/'));
cb();
}

function copyHTML(){
    return gulp.src('./app/*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
    .pipe(gulp.dest('./temp/'));
}

function copyCSS(){
return gulp.src('./app/css/*.css')
.pipe(gulp.dest('./temp/css/'));
}

function copyImages(){
    return gulp.src('./app/images/*')
    .pipe(gulp.dest('./temp/images/'));
}

function copyJS(){
    return gulp.src('./app/js/*.js')
    .pipe(gulp.dest('./temp/js/'));    
}

function watchFiles(cb){
    gulp.watch('./app/css/**/*.css',copyCSS)
    gulp.watch('./app/js/**/*.js',copyJS)
    gulp.watch('./app/images/**/*',copyImages)
    gulp.watch('./app/*.html',copyHTML)
    cb();
}

const watch = gulp.series(watchFiles);
const start = gulp.series(cleanTemp,copyFiles,watchFiles,webServer);
const build = gulp.series(cleanDist,scriptsLint,minifyCode,images);

exports.webServer = webServer;
exports.images = images;
exports.scriptsLint = scriptsLint;
exports.minifyCode = minifyCode;
exports.copyFiles = copyFiles;
exports.cleanDist = cleanDist;
exports.cleanTemp = cleanTemp;
exports.copyHTML = copyHTML;
exports.copyCSS = copyCSS;
exports.copyJS = copyJS;
exports.copyImages = copyImages;
exports.start = start;
exports.watch = watch;
exports.build = build;
// start development server
// gulp.task('start',() => {
//  gulp.src('./app/css/*.css')
// .pipe(gulp.dest('./temp/css/'));
// gulp.src('./app/images/*')
// .pipe(gulp.dest('./temp/images/'));
// gulp.src('./app/js/*.js')
// .pipe(gulp.dest('./temp/js/'));
// gulp.src('./app/*.html')
// .pipe(fileinclude({
//     prefix: '@@',
//     basepath: '@file'
//   }))
// .pipe(gulp.dest('./temp/'));
// return gulp.src('./temp')
// .pipe(webserver({
//     livereload: true,         
//     open: true,
//     port:3000
//   }));
// })

// gulp.task('watch',()=>{
//     gulp.watch('./app/*',series[start])
// })
// // Minify HTML CSS JS, Concat multiple css js files into one file, Include files from components 
// gulp.task('useref', ()=>{
//     return gulp.src('app/*.html')
//     .pipe(useref())
//     .pipe(gulpIf('*.js',uglify()))
//     .pipe(gulpIf('*.css',cssnano()))
//     .pipe(fileinclude({
//         prefix: '@@',
//         basepath: '@file'
//       }))
//     .pipe(htmlClean({
//         protect: /<\!--%fooTemplate\b.*?%-->/g,
//         edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
//       }))
//     .pipe(gulp.dest('dist/'))
// });

// // JSHint - linting javascript 
// gulp.task('lint',()=>{
//     return gulp.src('js/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'));
// })


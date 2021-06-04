const { watch, src, dest, series } = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

let output = 'package';
let themes = ['acg', 'reacg', 'light', 'gshang'];

// 处理 index js
function minifyIndex() {
    return src('index.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest(`${output}`));
}

// 处理 theme js
function minifyJs(done) {
    return themes.forEach((v) => {
        src(`theme/${v}/${v}.js`)
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(uglify())
            .pipe(dest(`${output}/theme/${v}`))
        done();
    })
}

// 处理 theme css
function minifyCss(done) {
    return themes.forEach((v) => {
        src(`theme/${v}/${v}.css`)
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(cleanCSS({ compatibility: 'ie8' }))
            .pipe(dest(`${output}/theme/${v}`))
        done();
    })
}

// 处理插件 js
function minifyPluginJs() {
    return src(`assets/js/*.js`)
        .pipe(dest(`${output}/assets/js`));
}
// 处理插件 css
function minifyPluginCss() {
    return src(`assets/css/*.css`)
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(dest(`${output}/assets/css`))
}
// 处理images/acg
function acgImageMin() {
    return src('assets/images/acg/*')
        .pipe(dest(`${output}/assets/images/acg`))
}
// 处理images/background
function musicMin() {
    return src('assets/music/*')
        .pipe(dest(`${output}/assets/music`))
}

// 处理音乐
function bgImageMin() {
    return src('assets/images/background/*')
        .pipe(dest(`${output}/assets/images/background`))
}


// 监听
function watchChanges() {
    watch('theme/*.js', minify);
    watch('theme/*.css', sasstocss);
}

exports.watchChanges = watchChanges;
exports.default = series(minifyIndex, minifyJs, minifyCss);

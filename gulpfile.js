const gulp = require("gulp");
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

function js(cb) {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err)
            }
            if (stats.hasErrors()) {
                let errors = stats.compilation.errors.map(
                    (error) => {
                        return error.file + '\n' + error.message;
                    }
                );

                return reject(new Error(errors.join('\n')))
            }
            resolve()
        })
    })
}

function styles(cb) {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
}

function watch() {
    return gulp.watch(
        '**/*',
        {
            ignored: [
                'dist/**/*',
                'tests/**/*',
            ]
        },
        gulp.series(js, styles)
    )
}

exports.build = gulp.series(js, styles)
exports.develop = gulp.series(js, styles, watch)

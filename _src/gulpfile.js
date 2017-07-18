const composer = require('gulp-uglify/composer');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const data = require('gulp-data');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('uglify-es');
const yaml = require('node-yaml');

const compressJS = composer(uglify, console);

// Set the destination directory for the build
const SRC = '.';
const DEST_BUILD = '..';
const DEST_DEV = '../.devbuild';
let DEST = DEST_BUILD;

function paths () {
  return {
    html: {
      all: `${SRC}/views/**/*.pug`,
      src: [`${SRC}/views/**/*.pug`, `!${SRC}/views/includes/*`],
      dst: DEST,
    },
    css: {
      all: `${SRC}/sass/**/*.sass`,
      src: [`${SRC}/sass/style.sass`],
      dst: `${DEST}/assets/css`,
    },
    js: {
      all: `${SRC}/js/**/*.js`,
      src: [`${SRC}/js/*.js`],
      dst: `${DEST}/assets/js`,
    },
    dest: [`${DEST}/**/*.html`, `${DEST}/assets/`],
  };
}

const from = gulp.src;
const to = gulp.dest;

// Render the pug templates w/ their respective locals
function html (done) {
  from(paths().html.src)
    .pipe(data((f) => {
      f = path.relative(`${SRC}/views`, f.path).slice(0, -4);
      return Object.assign({}, yaml.readSync(`${SRC}/data/global`),
        yaml.readSync(`${SRC}/data/${f}`));
    }))
    .pipe(pug())
    .pipe(to(paths().html.dst))
    .pipe(connect.reload());
  done();
}
gulp.task(html);

// Compile the SASS and copy to build directory
function css (done) {
  from(paths().css.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(to(paths().css.dst))
    .pipe(connect.reload());
  done();
}
gulp.task(css);

// Concatenate and ugify the JavaScript
function js (done) {
  from(paths().js.src)
    .pipe(concat('all.js'))
    .pipe(compressJS())
    .pipe(to(paths().js.dst))
    .pipe(connect.reload());
  done();
}
gulp.task(js);

// Wipe everything if necessary
gulp.task('clean', (done) => {
  del(paths().dest, done);
});

// Build everything.
const build_all = gulp.parallel(html, css, js);
gulp.task('default', build_all);

gulp.task('dev', (done) => {
  DEST = DEST_DEV;
  build_all();
  connect.server({
    livereload: true,
    root: DEST,
  });
  gulp.watch(paths().html.all, html);
  gulp.watch(paths().css.all, css);
  gulp.watch(paths().js.all, js);
  del(DEST_DEV, done);
});

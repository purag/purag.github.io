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
const src = '.';
const DEST_BUILD = '..';
const DEST_DEV = '../.devbuild';
let dest = DEST_BUILD;

const PORT_BUILD = 8080;
const PORT_DEV = 8081;
let port = PORT_BUILD;

function paths () {
  return {
    html: {
      all: [`${src}/views/**/*.pug`, `${src}/data/**/*.yml`],
      src: [`${src}/views/**/*.pug`, `!${src}/views/includes/*`],
      dst: dest,
    },
    css: {
      all: `${src}/sass/**/*.sass`,
      src: [`${src}/sass/style.sass`],
      dst: `${dest}/assets/css`,
    },
    js: {
      all: `${src}/js/**/*.js`,
      src: [`${src}/js/*.js`],
      dst: `${dest}/assets/js`,
    },
    dest: [`${dest}/**/*.html`, `${dest}/assets/`],
  };
}

// Render the pug templates w/ their respective locals
function html () {
  return gulp.src(paths().html.src)
    .pipe(data((f) => {
      const globals = yaml.readSync(`${src}/data/global`);
      f = path.relative(`${src}/views`, f.path).slice(0, -4);
      f = `${src}/data/${f}.yml`;
      let locals = {};
      if (fs.existsSync(f)) {
        locals = yaml.readSync(f);
      }
      return Object.assign({}, globals, locals);
    }))
    .pipe(pug())
    .pipe(gulp.dest(paths().html.dst))
    .pipe(connect.reload());
}
gulp.task(html);

// Compile the SASS and copy to build directory
function css () {
  return gulp.src(paths().css.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths().css.dst))
    .pipe(connect.reload());
}
gulp.task(css);

// Concatenate and ugify the JavaScript
function js () {
  return gulp.src(paths().js.src)
    .pipe(concat('all.js'))
    .pipe(compressJS())
    .pipe(gulp.dest(paths().js.dst))
    .pipe(connect.reload());
}
gulp.task(js);

// Build everything.
function build (done) {
  gulp.parallel(html, css, js)();
  done();
}
gulp.task(build);
gulp.task('default', build);

// Run the site locally.
function server (done) {
  gulp.series(build, (done) => {
    connect.server({
      livereload: true,
      port: port,
      root: dest,
    });
    done();
  })();
  done();
}
gulp.task(server);

// Wipe everything if necessary
function clean (done) {
  del.sync(paths().dest, {force: true});
  done();
}
gulp.task(clean);

// Development tasks
function dev (done) {
  dest = DEST_DEV;
  port = PORT_DEV;
  done();
}

function watch (done) {
  gulp.watch(paths().html.all, html);
  gulp.watch(paths().css.all, css);
  gulp.watch(paths().js.all, js);
  done();
}

gulp.task('dev:build', gulp.series(dev, build));

gulp.task('dev:server', gulp.series(dev, watch, server));

gulp.task('dev:clean', gulp.series(dev, clean, (done) => {
  del.sync(dest, {force: true});
  done();
}));

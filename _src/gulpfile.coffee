gulp = require "gulp"
data = require "gulp-data"
path = require "path"
fs   = require "fs"
pug  = require "gulp-pug"
del  = require "del"
sass = require "gulp-sass"
yaml = require "node-yaml"
cat  = require "gulp-concat"
name = require "gulp-rename"
cfee = require "gulp-coffee"
ugly = require "gulp-uglify"

# Set the destination directory for the build
SRC  = "."
DEST = ".."

paths =
  html:
    src: ["#{SRC}/views/**/*.pug", "!#{SRC}/views/includes/*"]
    dst: DEST
  css:
    src: ["#{SRC}/sass/*.sass"]
    dst: "#{DEST}/assets/css"
  js:
    src: ["#{SRC}/coffee/*.coffee"]
    dst: "#{DEST}/assets/js"
  dest: ["#{DEST}/**/*.html", "#{DEST}/assets/"]

from = gulp.src
to   = gulp.dest

# Compile the SASS and copy to build directory
gulp.task "css", ->
  from paths.css.src
    .pipe sass().on "error", sass.logError
    .pipe to paths.css.dst

# Render the pug templates w/ their respective locals
gulp.task "html", ->
  from paths.html.src
    .pipe data (f) ->
      f = path.relative("#{SRC}/views", f.path).slice(0, -4)
      Object.assign {}
        , (yaml.readSync "#{SRC}/data/global")
        , (yaml.readSync "#{SRC}/data/#{f}")
    .pipe pug()
    .pipe to paths.html.dst

# Compile and uglify the coffeescript
gulp.task "js", ->
  from paths.js.src
    .pipe cat "all.coffee"
    .pipe cfee()
    .pipe name "all.js"
    .pipe ugly()
    .pipe to paths.js.dst

# Wipe everything if necessary
gulp.task "clean", ->
  del paths.dest

gulp.task "default", ["html", "css", "js"]

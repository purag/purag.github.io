gulp = require "gulp"
data = require "gulp-data"
path = require "path"
fs   = require "fs"
pug  = require "gulp-pug"
del  = require "del"
sass = require "gulp-sass"
yaml = require "node-yaml"

# Set the destination directory for the build
SRC  = "."
DEST = ".."

paths =
  html: ["#{SRC}/views/**/*.pug", "!#{SRC}/views/includes/*"]
  css:  ["#{SRC}/sass/*.sass"]
  dest: ["#{DEST}/**/*.html", "#{DEST}/assets/"]

task = gulp.task
from = gulp.src
to   = gulp.dest

# Compile the SASS and copy to build directory
gulp.task "css", ->
  from paths.css
    .pipe sass().on "error", sass.logError
    .pipe to "#{DEST}/assets/css"

# Render the pug templates w/ their respective locals
gulp.task "html", ->
  from paths.html
    .pipe data (f) ->
      f = path.relative("#{SRC}/views", f.path).slice(0, -4)
      yaml.readSync "#{SRC}/data/#{f}"
    .pipe pug()
    .pipe to DEST

# Wipe everything if necessary
gulp.task "clean", ->
  del paths.dest

gulp.task "default", ["html", "css"]

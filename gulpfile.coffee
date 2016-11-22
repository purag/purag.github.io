gulp = require "gulp"
data = require "gulp-data"
path = require "path"
fs   = require "fs"
pug  = require "gulp-pug"

# Render the pug templates w/ their respective locals
gulp.task "html", ->
  gulp.src ["_views/**/*.pug"]
    .pipe data (f) ->
      f = path.relative("./_views", f.path).slice(0, -4)
      JSON.parse fs.readFileSync "_data/#{f}.json", "utf-8"
    .pipe pug()
    .pipe gulp.dest(".")

gulp.task "default", ["html"]

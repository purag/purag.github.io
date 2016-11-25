gulp = require "gulp"
data = require "gulp-data"
path = require "path"
fs   = require "fs"
pug  = require "gulp-pug"
del  = require "del"

# Render the pug templates w/ their respective locals
gulp.task "html", ->
  gulp.src ["views/**/*.pug", "!views/includes/*"]
    .pipe data (f) ->
      f = path.relative("./views", f.path).slice(0, -4)
      JSON.parse fs.readFileSync "data/#{f}.json", "utf-8"
    .pipe pug()
    .pipe gulp.dest("..")

gulp.task "clean", ->
  del("../**/*.html")

gulp.task "default", ["html"]

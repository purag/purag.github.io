gulp = require "gulp"
data = require "gulp-data"
path = require "path"
fs   = require "fs"
pug  = require "gulp-pug"
del  = require "del"

# Set the destination directory for the build
SRC  = "."
DEST = ".."

# Copy the CSS to the build directory
gulp.task "css", ->
  gulp.src ["#{SRC}css/style.css"], {base: SRC}
    .pipe gulp.dest(DEST)

# Render the pug templates w/ their respective locals
gulp.task "html", ->
  gulp.src ["#{SRC}/views/**/*.pug", "!#{SRC}/views/includes/*"]
    .pipe data (f) ->
      f = path.relative("#{SRC}/views", f.path).slice(0, -4)
      JSON.parse fs.readFileSync "#{SRC}/data/#{f}.json", "utf-8"
    .pipe pug()
    .pipe gulp.dest(DEST)

# Wipe everything if necessary
gulp.task "clean", ->
  del(["#{DEST}/**/*.html", "#{DEST}/css"])

gulp.task "default", ["html", "css"]

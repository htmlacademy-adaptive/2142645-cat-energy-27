import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import rename from 'gulp-rename';
import {deleteAsync as del} from 'del';
import csso from 'postcss-csso';
import htmlmin from 'gulp-html-minifier';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore'

const styles = (done) => {
  return gulp.src('source/sass/style.scss', {sourcemaps: true})
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', {sourcemaps: '.'}))
    .pipe(browser.stream())
    done();
}

const html = (done) => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build'))
    done();
}

const scripts = (done) => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(rename(function (path) {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream())
    done();
}

const optimizeImages = (done) => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
    done();
}

const copyImages = (done) => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
    done();
}

const createWebP = (done) => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*'])
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
    done();
}

const optimizeSVG = (done) => {
  return gulp.src(['source/img/**/*.svg', '!source/img/sprite/*'])
    .pipe(svgmin())
    .pipe(gulp.dest('build/img/'))
    done();
}

const sprite = (done) => {
  return gulp.src('source/img/sprite/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))
    done();
}

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.ico',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

const clean = (done) => {
  return del('build');
  done();
}

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

const reload = (done) => {
  browser.reload();
  done();
}

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts, reload));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizeSVG,
    sprite,
    createWebP
  )
)

export const start = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizeSVG,
    sprite,
    createWebP
  ),
  gulp.series(
    server,
    watcher
  )
)

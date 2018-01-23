
/*
  使用Flexible实现手淘H5页面的终端适配
  自动化gulp编译工具
  可以通过任意开发工具完成`src`下的编码，`gulp`会监视项目根目录下`src`文件夹，当文件变化自动编译
  
  环境：
  1、安装node
  2、安装gulp
  3、启动项目：npm run watch
  4、最终编写的文件会保存在dist目录

  可以参考以下资料：
  https://github.com/amfe/article/issues/17?utm_source=caibaojian.com
  https://www.w3cplus.com/PostCSS/postcss-quickstart-guide-gulp-setup.html
  
*/

var gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins')
var postcss = require('gulp-postcss');
const del = require('del')
const runSequence = require('run-sequence')

var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');
var px2rem = require('postcss-px2rem'); // https://www.npmjs.com/package/px2rem

// load all gulp plugins
const plugins = gulpLoadPlugins()
const env = process.env.NODE_ENV || 'development'
const isProduction = () => env === 'production'

// processors规则
var processors = [
  autoprefixer, // 处理浏览器私有前缀
  cssnext,      // 使用CSS未来的语法
  precss,       // 像Sass的函数
  px2rem({
    remUnit: 75, // set `rem` unit value (default: 75)
    // baseDpr: 2    // set base device pixel ratio (default: 2)
  })
];

/**
 * Clean distribution directory
 */
gulp.task('clean', del.bind(null, ['dist/*']))

/**
 * Lint source code
 */
gulp.task('lint', () => {
  // return gulp.src(['*.{js,json}', '**/*.{js,json}', '!node_modules/**', '!dist/**', '!**/bluebird.js'])
  //   .pipe(plugins.eslint())
  //   .pipe(plugins.eslint.format('node_modules/eslint-friendly-formatter'))
  //   .pipe(plugins.eslint.failAfterError())
})

/**
 * Compile js source to distribution directory
 */
gulp.task('compile:js', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.babel())
    .pipe(plugins.if(isProduction, plugins.uglify()))
    .pipe(gulp.dest('dist'))
})

/**
 * Compile css source to distribution directory
 */
gulp.task('compile:css', function () { 
  
  return gulp.src('src/**/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist')); 
});

/**
 * Compile less source to distribution directory
 */
gulp.task('compile:less', () => {
  return gulp.src(['src/**/*.less'])
    .pipe(plugins.less())
    .pipe(postcss(processors))
    .pipe(plugins.if(isProduction, plugins.cssnano({ compatibility: '*' })))
    .pipe(gulp.dest('dist'))
})

/**
 * Compile json source to distribution directory
 */
gulp.task('compile:json', () => {
  return gulp.src(['src/**/*.json'])
    .pipe(plugins.jsonminify())
    .pipe(gulp.dest('dist'))
})


/**
 * Compile img source to distribution directory
 */
gulp.task('compile:img', () => {
  return gulp.src(['src/**/*.{jpg,jpeg,png,gif}'])
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('dist'))
})

/**
 * Compile html source to distribution directory
 */
gulp.task('compile:html', () => {
  return gulp.src(['src/**/*.html'])
    .pipe(gulp.dest('dist'))
})

/**
 * Compile source to distribution directory
 */
gulp.task('compile', ['clean'], next => {
  runSequence([
    'compile:js',
    'compile:css',
    'compile:less',
    'compile:json',
    'compile:img',
    'compile:html'
  ], next)
})

/**
 * Copy extras to distribution directory
 */
gulp.task('extras', [], () => {
  return gulp.src([
    'src/**/*.*',
    '!src/**/*.js',
    '!src/**/*.css',
    '!src/**/*.less',
    '!src/**/*.json',
    '!src/**/*.{jpe?g,png,gif}',
    '!src/**/*.html'
  ])
  .pipe(gulp.dest('dist'))
})

/**
 * Build
 */
gulp.task('build', ['lint'], next => runSequence(['compile', 'extras'], next))


/**
 * Watch source change
 */
gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.js', ['compile:js'])
  gulp.watch('src/**/*.css', ['compile:css'])
  gulp.watch('src/**/*.less', ['compile:less'])
  gulp.watch('src/**/*.json', ['compile:json'])
  gulp.watch('src/**/*.{jpe?g,png,gif}', ['compile:img'])
  gulp.watch('src/**/*.html', ['compile:html'])
})

/**
 * Default task
 */
gulp.task('default', ['watch'])

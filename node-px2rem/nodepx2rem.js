/*
  node 版本编译px2rem
  node环境下执行：node nodepx2rem
  https://github.com/cuth/postcss-pxtorem
*/
var fs = require('fs');
var postcss = require('postcss');
var pxtorem = require('postcss-pxtorem');
var css = fs.readFileSync('./src/***/test.css', 'utf8');

var options = {
  rootValue: 75,
  unitPrecision: 5,
  propList: ['width', 'height', 'font', 'font-size', 'line-height', 'letter-spacing'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
};
var processedCss = postcss(pxtorem(options)).process(css).css;

fs.writeFile('./src/***/test-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});
var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var util = require('util')

var buildWinSetup = require('./build-win-setup.js')
var buildUpgrade = require('./build-upgrade')

var rootPath = path.resolve(__dirname, '../')

// get config
var config = require(path.resolve(rootPath, 'config'))

// `./package.json`
var tmpJson = require(path.resolve(rootPath, './package.json'))
var manifestPath = path.resolve(config.build.assetsRoot, './package.json')

// manifest for `./dist/package.json`
var manifest = {}
config.build.nw.manifest.forEach(function(v, i) {
  if (util.isString(v)) manifest[v] = tmpJson[v]
  else if (util.isObject(v)) manifest = util._extend(manifest, v)
})

fs.writeFile(manifestPath, JSON.stringify(manifest, null, '  '), 'utf-8', function(err) {
  if (err) throw err

  // start build app
  if (!config.build.nw.builder) return
  var NwBuilder = require('nw-builder')
  var nw = new NwBuilder(config.build.nw.builder)
  nw.build(function(err, data) {
    if (err) console.log(err)
    console.log('build nw done!')

    // build windows setup
    if (config.build.noSetup) return
    if (~config.build.nw.builder.platforms.toString().indexOf('win')) buildWinSetup().then(() => buildUpgrade(manifest))
    else buildUpgrade(manifest)
  })
})

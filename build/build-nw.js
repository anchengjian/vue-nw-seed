var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var util = require('util')

// var nwPath = require('nw').findpath()
var rootPath = path.resolve(__dirname, '../')
var distPath = path.resolve(rootPath, './dist')
var manifestPath = path.resolve(distPath, './package.json')

// get config
var config = require(path.resolve(rootPath, 'config'))

// `./package.json`
var tmpJson = require(path.resolve(rootPath, './package.json'))

// manifest for `./dist/package.json`
var manifest = {}
config.build.nw.manifest.forEach(function(v, i) {
  if (util.isString(v)) manifest[v] = tmpJson[v]
  else if (util.isObject(v)) manifest = util._extend(manifest, v)
})

fs.writeFile(manifestPath, JSON.stringify(manifest, null, '  '), 'utf-8', errHandle)

function errHandle(err, data) {
  if (err) throw err
}

// start build app
if (!config.build.nw.builder) return
var NwBuilder = require('nw-builder')
var nw = new NwBuilder(config.build.nw.builder)
nw.build(function(err) {
  if (err) console.log(err)
  console.log('all done!')
})

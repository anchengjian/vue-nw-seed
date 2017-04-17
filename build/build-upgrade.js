var path = require('path')
var fs = require('fs')

var rootPath = path.resolve(__dirname, '../')

// get config
var config = require(path.resolve(rootPath, 'config'))
var updCnf = config.build.nw.upgrade

// var platforms = ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']
var platforms = {
  'win32-setup': {
    name: 'win32',
    ext: '.exe'
  },
  'win64-setup': {
    name: 'win64',
    ext: '.exe'
  },
  'osx32': {
    name: 'osx32',
    ext: '.app'
  },
  'osx64': {
    name: 'osx64',
    ext: '.app'
  },
  'linux32': {
    name: 'linux32',
    ext: '.gz'
  },
  'linux64': {
    name: 'linux64',
    ext: '.gz'
  }
}

// `./output/pc.json`
module.exports = makeUpgrade

// makeUpgrade({ name: 'vue-nw-seed', appName: '应用的中文别名', version: '0.1.0' })
function makeUpgrade(manifest) {
  var upgradeJson = Object.assign({}, manifest, { packages: {} })

  // due to files
  updCnf.files.forEach(function(curPath) {
    var files = fs.readdirSync(curPath)

    files.forEach(function(fileName) {
      var platform = platforms[fileName]
      if (!platform) return
      upgradeJson.packages[platform.name] = { url: getPkgUrl(manifest, platform, fileName) }
    })
    makeJson(upgradeJson)
  })

}

function getPkgUrl(manifest, platform, fileName) {
  return `${updCnf.publicPath}${manifest.version}/${fileName}/${manifest.name}${platform.ext}`
}

function makeJson(json) {
  var upgradeAssetsRoot = path.parse(updCnf.outputFile).dir
  if (!fs.existsSync(upgradeAssetsRoot)) fs.mkdirSync(upgradeAssetsRoot)

  fs.writeFile(updCnf.outputFile, JSON.stringify(json, null, '  '), 'utf-8', function(err) {
    if (err) console.log(err)
    console.log('\n', 'build upgrade.json in:\n', updCnf.outputFile, '\n')
  })
}

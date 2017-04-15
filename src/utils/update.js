'use strict'

import { App } from 'nw.gui'
import fs from 'fs'
import path from 'path'
import http from 'http'
const events = require('events')

const { manifest } = App
const platform = (/^win/.test(process.platform) ? 'win' : /^darwin/.test(process.platform) ? 'osx' : 'linux') + (process.arch === 'ia32' ? '32' : '64')

const options = { method: 'GET', mode: 'cors', credentials: 'include' }
let tmpUpdateJson = null

// get update.json
export function getUpdateJson (noCache) {
  // if (!noCache && tmpUpdateJson) return new Promise((resolve, reject) => resolve(tmpUpdateJson))
  if (!noCache && tmpUpdateJson) return Promise.resolve(tmpUpdateJson)
  return window.fetch(manifest.manifestUrl + '?' + new Date().getTime(), options)
    .then(resp => resp.json())
    .then(json => {
      tmpUpdateJson = json
      return tmpUpdateJson
    })
}

export function parseName (json) {
  if (!json) return manifest.name
  return path.parse(json.packages[platform].url).base
}

// check version
export function checkUpdate () {
  getUpdateJson().then(json => {
    if (json.version === App.manifest.version) return
    window.location.hash = '/update'
  })
}

export function downloadHandle (savePath, json) {
  const ev = new events.EventEmitter()

  console.log(json.packages, platform)

  const uri = json.packages[platform].url
  const loadFile = fs.createWriteStream(savePath)

  http.get(uri, res => {
    if (res.statusCode < 200 || res.statusCode >= 300) return ev.emit('error', res.statusCode)
    res.on('end', () => {
      res.unpipe(loadFile)
      ev.emit('end', savePath)
    })
    res.on('error', err => ev.emit('error', err.message))

    res.pipe(loadFile)
  })

  return ev
}

// const rootPath = path.dirname(process.execPath)
// export function restartSelf(waitTime) {
//   setTimeout(() => {
//     require('child_process').spawn('restart.bat', [], { detached: true, cwd: rootPath })
//   }, ~~waitTime || 2000)
// }

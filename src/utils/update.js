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
  if (!json) return
  const pkg = json.packages[platform]
  if (!pkg) return
  return path.parse(pkg.url).base
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

  const uri = json.packages[platform].url
  const totalSize = json.packages[platform].size
  const loadFile = fs.createWriteStream(savePath)
  let loaded = 0

  http
    .get(uri, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) return ev.emit('error', res.statusCode)
      res.on('end', () => {
        loadFile.end()
        loadFile.destroySoon()
        ev.emit('end', savePath)
      })
      res.on('error', err => ev.emit('error', err.message))
      res.on('data', chunk => {
        loadFile.write(chunk)
        loaded += chunk.length
        ev.emit('data', loaded / totalSize)
      })
    })
    .on('error', err => ev.emit('error', err.message))

  return ev
}

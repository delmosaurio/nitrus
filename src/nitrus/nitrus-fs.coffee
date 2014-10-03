'use strict'

extend = require 'extend'
FileGateway = require 'file-gateway'

class NitrusFiles extends FileGateway
  constructor: (dir, conf) ->
    @conf = extend(
        true,
        process: true
        cache: expire: ((1000 * 60) * 10 ), length: 30
        extend: true
        encoding: 'utf-8'
        saveOnSet: true,
        conf
      )
    super dir, @conf
    @configure()

  configure: ->
    initConfig = [
      {key: "config-file", mode: "dynamic", type: "file", name: "CONFIG", json: true, defaults: {} }
      {key: "cache-folder", mode: "cache", type: "folder", name: "cache"}
      {key: "tmp-folder", mode: "temp", type: "folder", name: "tmp"}
    ]
    @add initConfig
    @

module.exports = NitrusFiles
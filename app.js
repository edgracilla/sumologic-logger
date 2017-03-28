'use strict'

const reekoh = require('reekoh')
const plugin = new reekoh.plugins.Logger()
const request = require('request')

let httpSource = null

plugin.on('log', (logData) => {
  if (!logData) return

  request.post({
    url: httpSource,
    json: logData
  }, (error) => {
    if (error) {
      console.error('Error on Sumologic.', error)
      plugin.logException(error)
    }
    plugin.log(JSON.stringify({
      title: 'Log sent to Sumologic',
      data: logData
    }))
  })
})

plugin.once('ready', () => {
  httpSource = plugin.config.httpSource
  plugin.log('Sumologic has been initialized.')
  plugin.emit('init')
})

module.exports = plugin


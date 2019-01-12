import puppeteer from './rods'
import socket from 'socket.io'

import Scraper from './scraper'
import Emitter from './Emitter'

import { LAUNCH_OPTIONS } from './consts'

import http from 'http'

var server = http.createServer(function(request, response) {
  response.writeHead(404)
  response.end('lllll')
})

export const io = socket(server)
export const emit = new Emitter(io)

const onSearch = async (params) => {
  emit.outputMessage({
    title: `Starting search`,
    text: `Searching for "${params.query}".`,
  })

  global.browser = await puppeteer.launch(LAUNCH_OPTIONS)
  const scraper = new Scraper(params)
}

io.on('connection', (client) => {
  client.on('search', onSearch)
})

server.listen(3000)

import puppeteer from './rods'
import socket from 'socket.io'

import Scraper from './scraper'
import Emitter from './Emitter'

import { LAUNCH_OPTIONS } from './consts'

export const io = socket()
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

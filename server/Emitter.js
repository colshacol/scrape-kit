export default class Emitter {
  constructor(io) {
    this.io = io
  }

  googleResults = (urls) => {
    this.io.emit('googleResults', urls)

    this.outputMessage({
      title: 'Got Google Results',
      text: `Found ${urls.length} results to scrape.`,
    })
  }

  emailsFound = (emails) => {
    console.log({ emails })
    this.io.emit('emailsFound', emails)

    this.outputMessage({
      title: 'Found email addresses',
      text: `${emails.length} emails scraped. (Total)`,
    })
  }

  outputMessage = (message) => {
    console.log(`\n${message.title}\n${message.text}\n`)
    this.io.emit('outputMessage', { ...message, date: Date.now() })
  }

  visitingHref = (url) => {
    this.io.emit('visitingHref', url)

    this.outputMessage({
      title: 'Scraping a new page',
      text: url.href,
    })
  }

  scrapingPage = (url) => {
    // this.io.emit('scrapingPage', url)

    this.outputMessage({
      title: 'Scraping a new page',
      text: url.href,
    })
  }

  pageScraped = (url) => {
    this.io.emit('pageScraped', url)

    this.outputMessage({
      title: 'Finished scraping page',
      text: url.href,
    })
  }

  hrefsFound = (hrefs) => {
    this.io.emit('hrefsFound', hrefs.length)

    this.outputMessage({
      title: 'Found inner links',
      text: `${hrefs.length} same-domain links found.`,
    })
  }

  deniedVisit = (reason, url) => {
    this.outputMessage({
      title: 'Skipping url for scrape',
      text: reason,
    })
  }
}

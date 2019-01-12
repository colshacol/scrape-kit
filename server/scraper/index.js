import { observable, autorun, computed } from 'mobx'
import puppeteer from '../rods'
import getEmails from 'email-regex'
import URL from 'url-parse'

// import observe from './observe'
import * as socket from '../socket'
import Stack from './Stack'
import catcher from './catcher'
import * as utilities from './utilities'

import {
  PAGE_DIMENSIONS,
  GOOGLE_ANCHOR_SELECTOR,
  IGNORED_HOSTS,
} from '../consts'

export default class Scraper {
  @observable googleResults = []
  @observable emails = []
  stack = new Stack()

  constructor(params) {
    this.params = params
    this.init()
  }

  @catcher init = async () => {
    await browser
    observe(this)
    this.google()
  }

  @catcher google = async () => {
      const googleHref = `https://google.com/search?q=${this.params.query}&num=100`
      const page = await browser.goToPage(googleHref)
      const hrefs = await page.queryAttributes(GOOGLE_ANCHOR_SELECTOR, 'href')
      this.googleResults = utilities.filterHrefs(hrefs)
      this.stack.add(this.googleResults)
      page.close()
  }

  @catcher scrape = async (url) => {
    try {

      const page = await browser.goToPage(url.href)
      const hrefs = await page.queryAttributes('a[href]', 'href')
      const emails = await page.scrapeEmails()
      this.emails = [...this.emails, ...emails]
      this.stack.add(hrefs)
      this.stack.setBusy()
      page.close()
    } catch(error) {
      console.log('ERROR\n', error)
      this.stack.setBusy()
    }
  }
}

const observeStack = (scraper) => {
  autorun(() => {
    const { next, busy } = scraper.stack

    if (next && !busy) {
      scraper.stack.setBusy(next)
      scraper.scrape(next)
    }
  })
}

const observeResults = (scraper) => {
  autorun(() => {
    if (scraper.googleResults.length) {
      socket.emit.googleResults(scraper.googleResults)
    }
  })
}

const observeEmails = (scraper) => {
  autorun(() => {
    if (scraper.emails.length) {
      socket.emit.emailsFound(scraper.emails)
    }
  })
}

const observe = (scraper) => {
  observeStack(scraper)
  observeResults(scraper)
  observeEmails(scraper)
}

// const createVisits = () => {
//   const visitedHrefs = []
//   const visitCount = {}

//   const register = (url) => {
//     visitedHrefs.push(url.href)
//     visitCount[url.host] = visitCount[url.host] + 1 || 1
//   }

//   const shouldSkip = (url) => {
//     if (visitCount[url.host] > 50) {
//       return 'Over 50 inner pages visited for host.'
//     }

//     if (visitedHrefs.includes(url.href)) {
//       return 'Already visited this url: ' + url.href
//     }
//   }

//   return {
//     register,
//     shouldSkip,
//   }
// }

// export default async (params) => {
//   const visits = createVisits()
//   const visitedUrls = []

//   class Visitor {
//     constructor(href) {
//       this.visit = this.visit.bind(this)
//       this.openPage = this.openPage.bind(this)
//       this.getContent = this.getContent.bind(this)
//       this.findHrefs = this.findHrefs.bind(this)
//       this.findEmails = this.findEmails.bind(this)
//       this.validateEmails = this.validateEmails.bind(this)
//       this.matchOrigin = this.matchOrigin.bind(this)
//       this.getAllHrefs = this.getAllHrefs.bind(this)

//       this.page = null
//       this.content = ''
//       this.emails = []
//       this.hrefs = []
//       this.url = new URL(removeWs(href))
//       this.href = href
//     }

//     async visit() {
//       await this.openPage()
//       await this.getContent()
//       await this.findEmails()
//       await this.findHrefs()
//       await this.page.close()
//       await Visitor.createVisitors(this.hrefs, this.visits)
//     }

//     async openPage() {
//       try {
//         this.page = await browser.newPage()
//         await this.page.goto(this.href, { waitUntil: 'networkidle2' })
//         visits.register(this.url)
//         socket.emit.visitingHref(this.href)
//       } catch (error) {
//         console.error('\n\n\n\n\n\nFailed to go to url: ', this.href)
//         console.error(error)
//       }
//     }

//     async getContent() {
//       try {
//         this.text = await this.page.$eval('body', (body) => {
//           return body.innerText
//         })
//       } catch (error) {
//         console.error('Failed to get content @ ', this.url.href)
//         this.text = ''
//       }
//     }

//     async findHrefs() {
//       try {
//         const allHrefs = await utilities.getHrefs()
//         const sameOriginUrls = this.matchOrigin(allHrefs)
//         const validHrefs = filterHrefs(sameOriginUrls)
//         socket.emit.hrefsFound(validHrefs)
//         this.hrefs = validHrefs
//       } catch (error) {
//         console.error(error)
//       }
//     }

//     async getAllHrefs() {
//       try {
//         return await this.page.$$eval('a', (anchors) => {
//           return anchors.map((anchor) => {
//             const href = anchor.getAttribute('href') || ''
//             return href.replace('www.', '')
//           })
//         })
//       } catch (error) {
//         console.error(error)
//       }
//     }

//     findEmails() {
//       const emails = Array.from(getEmails(this.content))
//       const validEmails = this.validateEmails(emails)
//       socket.emit.emailsFound(validEmails)
//       this.emails = validEmails
//     }

//     validateEmails(emails) {
//       return emails.filter((email) => {
//         const isValid = email.indexOf('.') >= 0 && email.indexOf('@') >= 0
//         // const isDuplicate = this.emails.includes(email)
//         return isValid
//       })
//     }

//     matchOrigin(urls) {
//       return urls.filter((url) => {
//         return url.startsWith(this.url.origin)
//       })
//     }

//     static async createVisitors(hrefs, visits) {
//       try {
//         for (const href of hrefs) {
//           console.log('creating visitor from ', href)
//           const visitor = new Visitor(href, visits)
//           const shouldSkip = visits.shouldSkip(visitor.url)
//           console.log('should skip: ', shouldSkip, visitor.url.href)
//           if (!shouldSkip) {
//             await visitor.visit()
//           }
//         }
//       } catch (error) {
//         console.error(error)
//       }
//     }
//   }
// }

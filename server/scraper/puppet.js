const puppeteer = require('puppeteer')
const visit = require('./visit')

const getUrls = require('url-regex')
const getEmails = require('email-regex')

const getResultsUrls = require('./utilities/getResultsUrls')
const getGoogleUrl = require('./utilities/getGoogleUrl')
const getPageHtml = require('./utilities/getPageHtml')
const CONSTS = require('./consts')
const context = require('./context')

const getEmailAddresses = async (text) => {
  const emails = Array.from(new Set(text.match(/[a-z0-9_.]+@[a-z0-9-.]+(com|net|io|co\.uk|us|pizza|shop|site)/ig)))
  return emails
}

const google = async (params) => {
  const store = new Store(params)
  const googleUrl = generateUrl(params)

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(googleUrl);
  await page.setViewport(PAGE_DIMENSIONS)
  await page.waitFor(ANCHOR_SELECTOR)

  const resultsUrls = await getResultsUrls(page)

  for (const pageUrl of resultsUrls) {
    const cleanUrl = pageUrl.replace('www.', '')
    const page = await browser.newPage();
    const url = new URL(cleanUrl)
    await page.goto(cleanUrl);


    const html = await page.$eval("body", body => {
      return body.innerHTML
    })

  }
}

class Store {
  params = {}
  urls = new Map()
  visitCount = {}

  constructor(params) {
    this.params = params
  }

  handleUrl(url) {
    const _url = url.replace('www.', '')
    const data = new URL(_url)
    this.urls.set(_url, data)
    this.visitCount[data.hostname] = 0
  }
}

const visitResultPages = async (urls) => {
  for (const url of resultsUrls) {
    siteResults = await visitPage({ url })
  }
}

const visitPage = async ({ browser, url }) => {
    const origin = urls.getOrigin(urls.cleanUrl(url))
    const html = await getPageHtml(page)
    const urls = await urls.getInternalUrls(page, origin, html)
    const emails = await getEmailAddresses(html)
  
    await page.close();
    return { emails }
  }
}

class Visitor {
  constructor(url) {
    this.url = url
  }
}

class PageVisitor {
  async bootstrap() {
    this.page = await browser.newPage();
    await page.goto(this.url);

    this.innerHTML = 

    this.domain = this.url

    this.hrefs = await this.page.$$eval('a', anchors => {
      return anchors.map(anchor => {
        return anchor.getAttribute('href')
      })
    })
  }

  async getInnerUrls() {
    return this.hrefs.filter(href => {

      return
    })
  }
}

// Get all results urls.
//   - Remove invalid (file) urls.
//   - Remove disallowed origins.
//   - Group urls by origin.

// For each origin, visit each url.
//   - Increment origin visits.
//   - Collect all email addresses.
//   - Collect all same-domain link urls.

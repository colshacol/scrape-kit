import puppeteer from 'puppeteer'
import getEmails from 'get-emails'
import validator from 'validator'

const proxyLayer = (target) => (methods) => {
  return new Proxy(target, {
    get(target, property) {
      return methods[property] || target[property]
    },
  })
}

const store = (() => {
  const launchOptions = {
    args: ['--start-fullscreen', '--window-size=1440,900'],
    ignoreHTTPSErrors: true,
    headless: true,
  }

  // TODO: Options validation / error handling.
  const setLaunchOptions = (options) => {
    Object.assign(launchOptions, options)
  }

  return {
    launchOptions,
    setLaunchOptions,
  }
})()

const proxiedPage = (page) => {
  const addMethods = proxyLayer(page)

  const queryAttributes = async (selector, attributeName) => {
    return await page.$$eval(
      selector,
      (elements, attributeName) => {
        return elements.map((element) => element.getAttribute(attributeName))
      },
      attributeName,
    )
  }

  const scrapeEmails = async () => {
    const text = await page.$eval('body', (body) => {
      return body.innerText
    })

    const emails = Array.from(getEmails(text))

    return emails.filter((email) => {
      return (
        email.indexOf('.') >= 0 &&
        email.indexOf('@') >= 0 &&
        validator.isEmail(email) &&
        !/^(\.|-|_)/.test(email) &&
        !/(\/|\\|#|\^|&|\*|\(|\)|\+|\=|\<|\>|\'|\")/.test(email)
      )
    })
  }

  return addMethods({
    queryAttributes,
    scrapeEmails,
  })
}

const proxiedBrowser = (browser) => {
  const addMethods = proxyLayer(browser)

  const goToPage = async (href, options) => {
    const page = await browser.newPage()
    await page.goto(href, options)
    return proxiedPage(page)
  }

  return addMethods({
    goToPage,
  })
}

class Puppeteer {
  launchOptions = store.launchOptions
}

const proxiedPuppeteer = (puppeteer) => {
  const addMethods = proxyLayer(puppeteer)

  const launch = async (options = this.launchOptions) => {
    const browser = await puppeteer.launch(options)
    return proxiedBrowser(browser)
  }

  return addMethods({
    setLaunchOptions: store.setLaunchOptions,
    launch,
  })
}

export default proxiedPuppeteer(puppeteer)

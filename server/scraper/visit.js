const puppeteer = require('puppeteer');
const getUrls = require('url-regex')
const getEmails = require('email-regex')

const state = {
  urls: new Set(),
  visited: 0,
  emails: new Set()
}

const getInnerUrls = async (page, state, text) => {
  const urls = Array.from(new Set(text.match(getUrls())))
  state.urls = new Set([...state.urls, ...urls ])
  console.log({ urls})
  return urls
}

const getEmailAddresses = async (page, state, text) => {
  const e = Array.from(new Set(text.match(/[A-Za-z0-9_.]+@[A-Za-z0-9-.]+[A-Za-z0-9-]/g)))
  console.log({ e, em: state.emails })
  return e
}

const visit = async (browser, url) => {
  state.visited++
  if (state.visited >55) { return { urls: [], emails: []} }
  const page = await browser.newPage();
  await page.goto(url);

  const text = await page.content()
  // const urls = await getInnerUrls(page, state, text)
  const emails = await getEmailAddresses(page, state, text)
  state.emails = new Set([...state.emails, ...emails ])

  // console.log({ urls, emails }, `VISITED: ${state.visited}\n\n\n\n`)

  await page.close();
  return { emails }
}

module.exports = visit
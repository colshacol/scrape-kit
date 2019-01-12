import { observable, action, computed } from 'mobx'
import { filterHrefs } from './utilities'
import * as socket from '../socket'
import compose from 'just-compose'
import URL from 'url-parse'

const getHrefs = (urls) => {
  return urls.map(url => url.href)
}

const getHosts = (urls) => {
  return urls.map(url => url.host)
}

const createUrls = (hrefs) => {
  return hrefs.map(href => new URL(href.replace('www.', '')))
}

const removeDuplicates = (stack, newUrls) => {
  const oldHrefs = getOldHrefs(stack)
  return newUrls.filter(url => !oldHrefs.includes(url.href))
}

const ignoreMaxedHosts = (stack, newUrls) => {
  const maxedHosts = getMaxedHosts(stack) || []
  
  return newUrls.filter(url => {
    return !maxedHosts.includes(url.host)
  })
}

const getOldHrefs = (stack) => {
  return getHosts([...stack.items, ...stack.history])
}

const getOldHosts = (stack) => {
  return getHosts([...stack.items, ...stack.history])
}

const getMaxedHosts = (stack) => {
  return getOldHosts(stack).find(host => {
    return stack.hostVisits[host] > 50
  })
}

const prepareNewUrls = (stack) => (hrefs) => {
  const filteredHrefs = filterHrefs(hrefs)
  const urls = createUrls(filteredHrefs)
  // Don't re-store old hrefs.
  const withoutDuplicates = removeDuplicates(stack, urls)
  // Don't store urls for maxed out hosts.

  return ignoreMaxedHosts(stack, withoutDuplicates)
}

export default class Stack {
  @observable items = []
  @observable history = []
  @observable busy = false
  hostVisits = {}

  @action add = (hrefs: string[]) => {
    const urls = prepareNewUrls(this)(hrefs)
    this.items = [...this.items, ...urls]
    this.incrementHostVisits(urls)
  }

  @action remove = (item: string) => {
    this.history.push(item)
    this.items = this.items.filter((_item) => _item !== item)
  }

  @action setBusy = (item: string) => {
    if (item) {
      socket.emit.scrapingPage(item)
      // console.log('getting busy with ', item)
    }

    if (!item) {
      // console.log('done with ', this.busy)
      socket.emit.pageScraped(this.busy)
      this.remove(this.busy)
    }

    this.busy = item
  }

  @computed get length() {
    return this.items.length
  }

  @computed get next() {
    return this.items.length ? this.items[0] : undefined
  }

  get priorHrefs() {
    return [...this.items, ...this.history].map(url => url.href)
  }

  incrementHostVisits = (urls) => {
    urls.forEach(url => this.hostVisits[url.host] = this.hostVisits[url.host] + 1 || 1)
  }
}

const INVALID_EXTENSIONS = ['.png', '.svg', '.php', '.js', '.', '.gif', '.jpg', '.jpeg', '.exe']
const GOOGLE_ANCHOR_SELECTOR = "#search .g .r > a:first-of-type"
const UNNEEDED_PREFIXES = ['https://', 'http://', 'www.']

const IGNORED_HOSTS = [
  'facebook',
  'quora',
  'myspace',
  'twitter',
  'instagram',
  'snapchat',
  'wikipedia',
  'google',
  'cloudflare',
]

const urls = (() => {
  const cleanUrl = (target) => {
    return UNNEEDED_PREFIXES.reduce((final, string) => {
       return final.replace(string, '')
    }, target)
  }

  const getOrigin = (target) => {
    return target.substring(0, target.indexOf('/'))
  }

  const getSameOriginUrls = (origin, urls) => {
    return urls.filter(url => {
      return url.startsWith(origin)
    })
  }

  const removeInvalidUrls = (urls) => {
    return urls.filter(url => {
      return !url.match(/(\/).+?\.([a-z0-9]{0,4})?$/)
    })
  }

  const getAllUrls = async (page) => {
    const urls = await page.$$eval('a', anchors => {
      return anchors.map(anchor => {
        return anchor.getAttribute('href')
      })
    })
  }

  const getInternalUrls = async (page, origin, html) => {
    const allHrefs = await getAllUrls(page)
    const sameOriginUrls = getSameOriginUrls(origin, allHrefs)
    return removeInvalidUrls(sameOriginUrls)
  }

  const getResultsUrls = async (page) => {
    const urls = await page.$$eval(GOOGLE_ANCHOR_SELECTOR, anchors => {
      return anchors.map(anchor => {
        return new URL(anchor.getAttribute('href').replace('www.', ''))
      })
    })
  
    const filtered = urls.filter(url => {
      return !IGNORED_HOSTS.some(host => {

      })
    })

    return removeInvalidUrls(filtered)
  }
})()
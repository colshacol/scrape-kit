

const context = (() => {
  const data = {
    stagedVisits: new Set(),
    pastVisits: new Set(),
    resultsUrls: new Set()
  }

  const storeResultsUrls = (urls) => {
    data.resultsUrls = new Set([...urls])
  }

  const stageVisits = (urls) => {
    data.stagedVisits = new Set([...data.stagedVisits, ...urls])
  }

  const storeVisisted = (url) => {
    data.pastVisits.add(url)
  }

  return {
    data,
    storeResultsUrls,
    stageVisits,
    storeVisited
  }
})()

module.exports = context
const alfy = require('alfy')

const APPLICATION_ID = 'bh4d9od16a'
const API_KEY = '1d8534f83b9b0cfea8f16498d19fbcab'
const INDEX_NAME = 'material-ui'
const URL = `https://${APPLICATION_ID}-dsn.algolia.net/1/indexes/*/queries?x-algolia-application-id=${APPLICATION_ID.toUpperCase()}&x-algolia-api-key=${API_KEY}`

alfy
  .fetch(URL, {
    method: 'POST',
    body: {
      requests: [{
        indexName: INDEX_NAME,
        params: `query=${alfy.input}&hitsPerPage=5`
      }]
    }
  })
  .then(({ results }) => {
    const { hits } = results[0]
    const items = hits.map(result => {
      const entry = {
        title: `${result.hierarchy.lvl1} > ${result.hierarchy.lvl2 || result.anchor}`,
        subtitle: result._snippetResult.content.value.replace(/<[^>]+>/g, '').replace(/\n/g, ' ') + '...',
        arg: result.url,
        quicklookurl: result.url,
        mods: {
          alt: {
            subtitle: `${result.hierarchy.lvl0} > ${result.hierarchy.lvl1}`
          }
        }
      }

      if (result.anchor === '__next') {
        entry.title = `${result.hierarchy.lvl1} > ${result.hierarchy.lvl2} > ${result.hierarchy.lvl3}`
      }

      return entry
    })

    alfy.output(items)
  })
  .catch(alfy.error)

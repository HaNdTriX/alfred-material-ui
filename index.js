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
        params: `query=${alfy.input}&hitsPerPage=6`
      }]
    }
  })
  .then(({ results }) => {
    const { hits } = results[0]
    const items = hits.map(result => ({
      title: Object.values(result.hierarchy)
        .filter(Boolean)
        .join(' > '),
      subtitle: result._snippetResult.content.value
        .replace(/<[^>]+>/g, '')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ') + '...',
      arg: result.url,
      quicklookurl: result.url,
      mods: {
        alt: {
          subtitle: result.anchor
        }
      }
    }))

    alfy.output(items)
  })
  .catch(alfy.error)

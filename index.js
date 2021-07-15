const alfy = require("alfy");

const APPLICATION_ID = "bh4d9od16a";
const API_KEY = "1d8534f83b9b0cfea8f16498d19fbcab";
const url = `https://${APPLICATION_ID}-dsn.algolia.net/1/indexes/*/queries?x-algolia-application-id=${APPLICATION_ID.toUpperCase()}&x-algolia-api-key=${API_KEY}`;
const indexName = "material-ui";
const hitsPerPage = alfy.userConfig.get("hitsPerPage");
const language = alfy.userConfig.get("language");
const branch = alfy.userConfig.get("branch");
const query = alfy.input;
const facetFilters = JSON.stringify([
  `version:${branch}`,
  `language:${language}`,
]);

const items = await alfy.fetch(url, {
  method: "POST",
  body: {
    requests: [
      {
        indexName,
        params: new URLSearchParams({
          query,
          hitsPerPage,
          facetFilters,
        }).toString(),
      },
    ],
  },
  transform: ({ results }) =>
    results[0].hits.map((result) => ({
      title: Object.values(result.hierarchy).filter(Boolean).join(" > "),
      subtitle:
        result._snippetResult.content.value
          .replace(/<[^>]+>/g, "")
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ") + "...",
      arg: result.url,
    })),
});

alfy.output(items);

import alfy from "alfy";

const APPLICATION_ID = "bh4d9od16a";
const API_KEY = "1d8534f83b9b0cfea8f16498d19fbcab";
const url = `https://${APPLICATION_ID}-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.10.5)%3B%20Browser%20(lite)%3B%20docsearch%20(3.0.0)%3B%20docsearch-react%20(3.0.0)&x-algolia-api-key=${API_KEY}&x-algolia-application-id=${APPLICATION_ID.toUpperCase()}`;
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
  json: {
    requests: [
      {
        query,
        indexName,
        params: new URLSearchParams({
          hitsPerPage,
          facetFilters,
        }).toString(),
      },
    ],
  },
  transform: ({ results }) =>
    results[0].hits.map((hit) => {
      const { lvl0, ...other } = hit.hierarchy;
      return {
        title: Object.values(other).filter(Boolean).join(" > "),
        subtitle: lvl0,
        arg: hit.url,
      };
    }),
});

alfy.output(items);

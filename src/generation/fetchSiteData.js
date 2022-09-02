export default async function fetchSiteData(site, allSitesByName, queryParams = {}) {
  const data = {
    sites: allSitesByName,
    site,
  };

  for (let source of site.sources) {
    data[source.name] = await source.fetchData(site, queryParams);
  }

  return data;
}

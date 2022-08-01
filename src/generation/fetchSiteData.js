export default async function fetchSiteData(site, allSitesByName) {
  const data = {
    sites: allSitesByName,
    site,
  };

  for (let source of site.sources) {
    data[source.name] = await source.fetchData(site);
  }

  return data;
}

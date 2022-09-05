export default async function createPagesFromContentSources(site, data) {
  const clusters = [];

  for (let source of site.sources) {
    const sourceData = data[source.name];
    if (!!sourceData) {
      clusters.push(await source.createPages(site, sourceData));
    }
  }

  const hookPages = await site.hooks?.createPagesForSite?.call(null, { site, data });
  if (!!hookPages) {
    clusters.push(hookPages);
  }

  return clusters.flat();
}

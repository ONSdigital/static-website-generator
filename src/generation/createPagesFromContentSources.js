export default function createPagesFromContentSources(site, data) {
  const clusters = [];

  for (let source of site.sources) {
    const sourceData = data[source.name];
    if (!!sourceData) {
      clusters.push(source.createPages(site, sourceData));
    }
  }

  const hookPages = site.hooks?.createPagesForSite?.call(null, { site, data });
  if (!!hookPages) {
    clusters.push(hookPages);
  }

  return clusters.flat();
}

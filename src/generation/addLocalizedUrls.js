export default function addLocalizedUrls(processedSites) {
  for (let processedSite of Object.values(processedSites)) {
    // Skip if processed site isn't linked to any other sites.
    if (!processedSite.linkedSites || processedSite.linkedSites.length === 0) {
      continue;
    }

    const linkedSites = processedSite.linkedSites.map(linkedSiteName => processedSites[linkedSiteName]);
    const localizedSiteGroup = [ processedSite, ...linkedSites ];

    for (let page of processedSite.pages) {
      page.localizedUrls = Object.fromEntries(localizedSiteGroup.map(otherProcessedSite => 
        [
          otherProcessedSite.name,
          otherProcessedSite.pages.find(otherPage =>
            (page.handle === otherPage.handle && page.id !== undefined && page.id === otherPage.id)
          )?.absoluteUrl,
        ]
      ));
    }
  }
}

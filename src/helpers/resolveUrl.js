export default function resolveUrl(url, { site, cms }) {
  // Resolve external resources for when using the CMS data source.
  url = url.replace(/^(https?:[/])?[/][a-z0-9_/.:-]*external-resource[/](\d+)/, (_, prototcol, externalRef) => {
    return cms?.getEntryById(externalRef)?.url;
  });

  // GraphQL responses from Craft often include URLs relative to the API domain.
  // These need to be rebased onto the site's base URL.
  if ((site.craftBaseUrl ?? "").startsWith("http")) {
    url = url.replace(site.craftBaseUrl, site.baseUrl);
  }

  // Replace '/@root/' placeholder with the site's base URL.
  return url.replace("/@root/", site.baseUrl);
}

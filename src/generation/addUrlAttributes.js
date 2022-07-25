export default function addUrlAttributes({ pages, site }) {
  for (let page of pages) {
    if (page.uri === "__home__") {
      page.uri = "";
    }
  
    page.absoluteUrl = site.absoluteBaseUrl + page.uri;
    page.url = site.baseUrl + page.uri;
  }
}

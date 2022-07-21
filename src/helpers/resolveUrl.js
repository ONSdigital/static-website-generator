export default function resolveUrl(url, context) {
  return url.replace("/@root/", context.site.baseUrl);
}

# Creating a custom content source

Each content source is implemented as a class with the following interface:

```ts
interface ContentSource {
  // Any configuration options should be provided via its constructor.
  constructor(options: any);

  // Gets the name of the content source (i.e. "custom").
  get name(): String;

  // Fetches all data of interest from the content source which will then
  // be available to templates with the alias `custom` (i.e. `custom.foo.bar`).
  async fetchData(site: Site): SiteData;

  // Creates pages from the site data.
  createPages(site: Site, data: SiteData): Page[];
}
```

You may find it helpful to use the provided content source implementations as reference when implementing a custom content source.

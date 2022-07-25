# Project sites configuration

The project `./config/sites.js` file exports an array of objects that define the configuration for each site.


## Site details

The following properties are required for each site:

- `name` (String) - Name of the website (eg. "en"). Static content for the site will be found inside the `./content/{site.name}/` directory. If using CraftCMS then content will be queried from a site with the name `{site.name}`.

- `absoluteBaseUrl` (String) - Absolute base URL for generated pages (eg. "https://example.com/" or "/"). This is useful when linking between sites that are hosted on separate domains (eg. between "https://example.com/cookies" and "https://cy.example.com/cwcis").

- `baseUrl` (String) - This can be either an absolute or relative base URL for generated pages (eg. "https://example.com/" or "/").

- `domain` (String) - The domain of the site (eg. "example.com").

- `sources` (Array\<[Source](#content-sources)\>) - Configures content sources for the site.

- `templatesPath` (String) - Path to the templates directory for this site. Defaults to "templates" directory in root of project.

These can typically be setup with environment variables as follows:

```js
const staticSourceConfig = {
  sourceDirectory: path.resolve("./content"),
};

export default [
  {
    name: "en",
    absoluteBaseUrl: process.env.ONS_EN_ABSOLUTE_BASE_URL,
    baseUrl: process.env.ONS_EN_BASE_URL,
    domain: process.env.ONS_EN_ABSOLUTE_BASE_URL.replace(/http(s)?\:\/\/|\/$/g, ""),
    sources: [
      new StaticSource(staticSourceConfig),
    ],
  },

  {
    name: "cy",
    absoluteBaseUrl: process.env.ONS_CY_ABSOLUTE_BASE_URL,
    baseUrl: process.env.ONS_CY_BASE_URL,
    domain: process.env.ONS_CY_BASE_URL.replace(/http(s)?\:\/\/|\/$/g, ""),
    sources: [
      new StaticSource(staticSourceConfig),
    ],
  },
];
```


## Content sources

In order for the generate to render the pages for a website it needs a source of content data and page objects. These are defined on a per-site basis allowing each site to be configured as needed.

For example, if a project generates the following three websites:

- "en" - Has content sourced from a CraftCMS instance and from static source files.
- "ni" - Has content sourced from only static source files.
- "cy" - Has content sourced from a CraftCMS instance and from static source files.

Then the configuration might look something like this:

```js
export default [
  {
    name: "en",
    /* ...other site params... */
    sources: [
      new StaticSource(staticSourceConfig),
      new CraftCmsSource(craftCmsSourceConfig),
    ],
  },

  {
    name: "ni",
    /* ...other site params... */
    sources: [
      new StaticSource(staticSourceConfig),
    ],
  },

  {
    name: "cy",
    /* ...other site params... */
    sources: [
      new StaticSource(staticSourceConfig),
      new CraftCmsSource(craftCmsSourceConfig),
    ],
  },
];
```

### Static source options

- **sourceDirectory** (String) (Required) - Path to the content directory (eg. "./content/").

### CraftCMS source options

- **graphQL.createClient** ((endpoint, options): Client) (Required) - Factory function that is used to create the GraphQL client. If using the [graphql-request package](https://github.com/prisma-labs/graphql-request) then this can be configured as follows:

    ```js
    createClient: (endpoint, options) => new GraphQLClient(endpoint, options),
    ```

- **graphQL.endpoint** (String) (Required) - URL of Craft CMS GraphQL endpoint (eg. "https://cms.example.com/api/data").

- **graphQL.headers** (Object) (Required) - Headers to include when making GraphQL request. This would include the GraphQL "Authorization" header.

- **graphQL.queryFilePath** (String) (Required) - Path to the GraphQL query file (eg. "./graphql/content.gql").


## Linked sites

Sites can be linked by with the `linkedSites` site configuration. A page from the "en" and "cy" site will be linked provided that they have the same `id` attribute.

> It is possible to link a static page to a cms page provided that the page object has the same `id` attribute.

With the following example `localizedUrls` are added to all pages in the "en" and "cy" sites but not for the  "ni" site.

```js
export default [
  {
    name: "en",
    linkedSites: [ "cy" ],
    /* ...other site params... */
  },

  {
    name: "ni",
    /* ...other site params... */
  },

  {
    name: "cy",
    linkedSites: [ "en" ],
    /* ...other site params... */
  },
];
```


## Hooks

Hooks are called as the website is being generated allowing for the geenration process to be customised to meet project specific needs and only need to be defined as needed.


### Example configuration

To provide the `setupNunjucks` hook to add a custom filter create the hook file `./config/hooks/setupNunjucks.js`:

```js
export default function setupNunjucks(nunjucksEnvironment) {
  nunjucksEnvironment.addFilter("test", () => "Test");
}
```

Inside `./config/hooks.js` export all of the hooks; in this case `setupNunjucks`:

```js
export { default as setupNunjucks } from "./hooks/setupNunjucks.js";
```

And then specify which hooks to use for each site:

```js
import * as hooks from "./hooks.js";

export default [
  {
    name: "en",
    /* ...other site params... */
    hooks,
  },

  {
    name: "cy",
    /* ...other site params... */
    hooks,
  },
];
```

> It is possible to setup different sets of hooks for each site; a useful naming convention for this is `./config/hooks.en.js`.


### `hooks.setupNunjucks({ nunjucksEnvironment })`

Provides an opportunity to register custom filters, extensions and globals for [Nunjucks](https://mozilla.github.io/nunjucks/) templating.

#### Context

- **nunjucksEnvironment** ([NunjucksEnvironment](https://mozilla.github.io/nunjucks/api.html#environment)) - The nunjucks environment that is being setup.


### `hooks.preprocessDataForSite({ site, data })`

Pre-process site data before pages are created.

#### Context

- **site** (Site) - Site configuration.
- **data** (Object) - Data blob for site.


### `hooks.createPagesForSite({ site, data })`

For procedurally generating pages.

#### Context

- **site** (Site) - Site configuration.
- **data** (Object) - Data blob for site.


### `applyTransformsToPages({ pages, site, data })`

Applies transformations to pages before they are rendered.

#### Context

- **pages** (Array\<Page\>) - Array of all page objects.
- **site** (Site) - Site configuration.
- **data** (Object) - Data blob for site.


### `async postprocessPageOutput({ output, page, processedSite })`

Post-process pages after they have been rendered.

#### Context

- **output** (String) - Rendered page output (eg. the HTML).
- **page** (Page) - Page data object.
- **processedSite** (ProcessedSite) - Site configuration with additional `data` and `pages` properties.


### `async afterPagesWritten({ siteOutputPath, processedSite })`

Invoked for each generated website to perform custom operations after the generated output has been written. This can be useful for copying static files into the generated website output.

#### Context

- **siteOutputPath** (String) - Path of site output directory (eg. "./dist/en/").
- **processedSite** (ProcessedSite) - Site configuration with additional `data` and `pages` properties.

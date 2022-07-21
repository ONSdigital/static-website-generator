# static-website-generator

A general purpose website generator which can render pages from static markdown files, nunjucks templates, CraftCMS instances, or from custom content sources. The generator makes the [ONS Design System](https://github.com/ONSdigital/design-system) components and macros available to templates as pages are being processed and rendered.

> This package treats the [@ons/design-system](https://github.com/ONSdigital/design-system) package as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) leaving the website project to include the desired version.


## Getting started with a new project

Install the static website generator:

```
yarn add https://github.com/ONSdigital/static-website-generator#v1.0.2
```

Install the required version of the ONS Design System; for example, to install the latest version:

```
yarn add @ons/design-system
```

At minimum a project directory must contain the file `./config/sites.js` to configure sites.

Website projects can be structured however desired; however the following pattern works well:

- `./content/{site-name}/` - Contains static source content for a site (at the very least should contain an empty placeholder file like `.gitkeep`).

- `./static/` - Static files to copy into output website.

- `./static-dev/` - Static files to copy into output website for local development only (have these excluded in `.gitignore`).

The following is recommended for CraftCMS sources:

- `./graphql/content.gql` - GraphQL query to fetch content from CMS.


## Using the CLI

1. Navigate to your website project directory (contains "config" directory).
2. Run `generate-website` to generate the website into an output directory "dist".
3. Preview website output using a tool like `npx serve dist`.

> Ideally the website project should contain scripts like the following:
> ```json
> "scripts": {
>   "build": "generate-website",
>   "serve": "npx serve dist",
>   "preview": "yarn build && yarn serve"
> }
> ```


## Documentation

- [Project sites configuration](./docs/project-sites-configuration.md)
- [Static content](./docs/static-content.md)
- [CraftCMS GraphQL queries](./docs/craftcms-graphql-queries.md)
- [Templating](./docs/templating.md)
- [Creating a custom content source](./docs/creating-a-custom-content-source.md)

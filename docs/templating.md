# Templating

## Template resolution

When a page is being rendered the template is resolved explicitly by using the template specified by the `layout` frontmatter parameter.

For example, the following example would use the "templates/layout/test/page.njk" template:

```yaml
---
title: Test page
layout: test/page
---
```


## Disable layout templating

Templating can be disabled for a page by specifying a `null` layout with:

```markdown
---
title: Test page
layout: ~
---
```

In the case of a Nunjucks static source (eg. `content/en/example.njk`) the content itself will still be rendered using Nunjucks but the output will not be wrapped inside the layout's Nunjucks templating.


## Template globals

The following globals are provided to templates by the generator:

---
  - `designSystemVersion` (string) - Semantic version of the design package.
---
  - `site.name` - **string** - Name of the current site; eg. "cy".
  - `site.absoluteBaseUrl` - **string** - Absolute base URL of the current site; eg. "http://localhost:8080/cy/".
  - `site.siteBaseUrl` - **string** - Base URL of the current site; eg. "/ni/".
  - `site.domain` - **string** - Domain of the current site; eg. "example.com".
  - `site.title` - **string** - Localized website title from `generalGlobals.siteTitle`.
---
  - `page` - **object** - The current page either from static content, CraftCMS content or procedurally generated content.
---
  - `cms.getEntryById(id: number): object|null` - **function** - Gets an entry or null with the given ID.
  - `cms.getCategoryById(id: number): object|null` - **function** - Gets a category or null with the given ID.
  - `cms.getAssetById(id: number): object|null` - **function** - Gets an asset or null with the given ID.
---


## Accessing data from templates

Templates have access to all content source data following the notation `contentSourceName.dataKey`. Here are some examples:

```nunjucks
Accessing some global from a CraftCMS instance:
{{ cms.generalGlobals.someField }}

Accessing some value from a custom content source:
{{ custom.foo.bar }}
```


## Template filters

The following custom filters have been defined for use in templates:

- `localize(context = "main")` - Allows strings to be automatically localized when a localized string is defined; eg. `"Table of contents" | localize`. A language context can be provided for situations where there would be ambiguity, eg. `"Add" | localize("maths")`.

- `date(format, locale = "en-gb")` - Formats a date using [moment.js](https://momentjs.com/).

- `setProperty(key, value)` - Adds a property to an object which is useful in situations where properties need to be conditionally provided to a design system component. eg.
  ```nunjucks
  {% set options = {
    "first": "First option"
  } %}
  {% if xyz %}
      {% set options = options | setProperty("second", "Second option") %}
  {% endif %}
  ```

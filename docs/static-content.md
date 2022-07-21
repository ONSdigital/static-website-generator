# Static content

To provide static content for a site add the file into the respective `content` directory; for example, `content/en/`.

## Supported formats

- .md (Markdown)
- .html (HTML)
- .njk (Nunjucks)

Static content files can have frontmatter data; for example,

```md
---
title: Example page title
---

## Est saepe quas 33 blanditiis quam

Lorem ipsum dolor sit amet. Ea officiis voluptatem aut dolores porro qui vero quod sed velit iste in quas quia qui Quis praesentium.
```

## Templating

By default the `templates/page/default.njk` template is used to render static content. This can be overridden by specifying a different `layout`:

```md
---
title: Example page title
layout: another-layout
myData: 42
---

This page will be rendered using `templates/page/another-layout.njk`.
```

The page's body content can be rendered with the following:

```nunjucks
{{ page.body | safe }}
```

Frontmatter data can be used in Nunjucks templates:

```nunjucks
My Data: {{ page.myData }}
```

## Nunjucks content

A nunjucks content file (eg. `content/en/test.njk`) can include templates in the same way as with regular templating and has access to its own frontmatter data:

```nunjucks
---
title: An example page
myData: 42
---

{% extends "base.njk" %}

{% block pageContent %}
    <h3>My Data: {{ page.myData }}</h3>
{% endblock %}
```

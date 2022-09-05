# CraftCMS GraphQL queries

The CraftCMS content source pulls all content from a CraftCMS instance using the provided GraphQL query for each specific site.


## Parameters

- `$site` - Name of the website inside the CraftCMS instance that is being generated. This can be used by the query to filter content for that site (see below for an example).


## Referenced elements syntax extensions

Logic has been added to the static website generator to automatically transform data resulting from a GraphQL query to simulate the way in which items can be accessed when developing templates for CraftCMS (i.e. if using Twig templating inside CraftCMS).

Element references are automatically resolved when their identifiers have the appropriate referencing key:

- `_entryRef` - references a specific entry by id.
- `_categoryRef` - references a specific category by id.
- `_tagRef` - references a specific tag by id.
- `_assetRef` - references a specific asset by id.

For example, if the content schema allowed "Example Page" entries to reference other "Example Page" entries then the GraphQL query might look something like this:

```graphql
query Data($site: [String]) {
  entries(site: $site) {
    id
    sectionHandle
    typeHandle
    slug
    uri
    title

    ...on page_example_Entry {
      relatedPages { ..._entryRef: id }
    }
  }
}
```

By using `_entryRef` above it becomes possible for templates within the website generator to access the related pages in the following way:

```nunjucks
<ul>
  {% for relatedPage of page.relatedPages %}
    <li>{{ relatedPage.title }}</li>
  {% endfor %}
</ul>
```


## Pulled element syntax extension

Often a content schema will have an element type (be that an entry, category, asset, etc) reference a specific entry within the CMS (eg. "Thumbnail asset"). The CMS will return an array of elements even when only the one is desired. Instead of having templates deal with this complexity, this website generator provides an extension which pulls exactly one element from such a field.

For example, if the content schema allowed "Blog article" to reference an asset with the field "Thumbnail asset":

```graphql
query Data($site: [String]) {
  entries(site: $site) {
    id
    sectionHandle
    typeHandle
    slug
    uri
    title

    ...on blog_article_Entry {
      # Reference the thumbnail asset:
      thumbnailAsset__pull__: thumbnailAsset { _assetRef: id }

      # Additional image transformations:
      thumbnailSmall__pull__: thumbnailAsset {
        url @transform(width: 547)
      }
      thumbnailLarge__pull__: thumbnailAsset {
        url @transform(width: 1094)
      }
    }
  }
}
```

Templates can then access the thumbnail asset like this:

```nunjucks
{% from "components/images/_macro.njk" import onsImage %}
{{
    onsImage({
        "image": {
            "smallSrc": page.thumbnailSmall.url,
            "largeSrc": page.thumbnailLarge.url
        },
        "caption": page.thumbnailAsset.title
    })
}}
```

> If there is no reference then the `__pull__` syntax yields `null`.


## Minimum requirements when querying entries

The following is the minimum for the generator to query entries from the CMS:

```graphql
query Data($site: [String]) {
  entries(site: $site) {
    id
    sectionHandle
    typeHandle
    slug
    uri
    title

    # Request other things as needed...
  }
}
```


## Including global sets in query

Any global sets that are defined in the CMS can be accessed via GraphQL queries which are then accessible by templates whilst generating the static website pages:

```graphql
query Data($site: [String]) {
  generalGlobals: globalSet(site: $site, handle: "general") {
    ...on general_GlobalSet {
      siteTitle
      primaryNavigation__pull__: primaryNavigation { _entryRef: id }
      footerNavigation__pull__: footerNavigation { _entryRef: id }
    }
  }

  newsSettingsGlobals: globalSet(site: $site, handle: "newsSettings") {
    ...on newsSettings_GlobalSet {
      sectionPath
      sectionTitle
      summary
      numberOfEntriesPerPage
    }
  }
}
```

> A useful naming convention is used in the above example `{globalSetName}Globals`.


## Writing clean queries

There will typically be complex Matrix/SuperTable/etc fields which are reused across multiple entry types. These detailed structures should not be repeated within the same query; instead the GraphQL fragment syntax should be used.

For example, to define a "Content blocks" field which is available on multiple entry types:

```graphql
query Data($site: [String]) {
  entries(site: $site, orderBy: "postDate desc") {
    id
    sectionHandle
    typeHandle
    slug
    uri
    title

    ...on page_standard_Entry {
      summary
      contentBlocks { ...contentBlocks_MatrixField_Fragment }
    }

    ...on news_article_Entry {
      summary
      newsCategories { _categoryRef: id }
      contentBlocks { ...contentBlocks_MatrixField_Fragment }
    }
  }
}

fragment contentBlocks_MatrixField_Fragment on contentBlocks_MatrixField {
  ...on contentBlocks_text_BlockType {
    typeHandle
    text
  }

  ...on contentBlocks_image_BlockType {
    typeHandle
    imageAsset__pull__: imageAsset { _assetRef: id }
    smallImage__pull__: imageAsset {
      url @transform(width: 800)
    }
    largeImage__pull__: imageAsset {
      url @transform(width: 1600)
    }
    caption
  }

  ...on contentBlocks_panel_BlockType {
    typeHandle
    panelType
    panelText
  }
}
```

import resolveUrl from "../../helpers/resolveUrl.js";

export default function itemsList_from_navigationItemsFilter(navigationItems) {
  if (!navigationItems) {
    return [];
  }

  // Note: "text" and "title" are both required since the design system is inconsistent
  // with usage in "itemsList" implementations.
  return navigationItems
    .map(item => {
      if (item.typeHandle === "entryNavigationItem") {
        return {
          text: item.targetEntry?.navigationTitle,
          title: item.targetEntry?.navigationTitle,
          url: item.targetEntry?.url,
          ariaLabel: item.targetEntry?.navigationTitle !== item.targetEntry?.title
            ? item.targetEntry?.title
            : null,
        };
      }
      else if (item.typeHandle === "urlNavigationItem") {
        return {
          text: item.labelText,
          title: item.labelText,
          url: resolveUrl(item.targetUrl, this.getVariables()),
        };
      }
      else {
        return null;
      }
    })
  .filter(item => item !== null);
}

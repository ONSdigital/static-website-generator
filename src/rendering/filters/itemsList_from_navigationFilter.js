export default function itemsList_from_navigationFilter(navigation) {
  if (!navigation) {
    return [];
  }

  // Note: "text" and "title" are both required since the design system is inconsistent
  // with usage in "itemsList" implementations.
  return navigation
    .map(item => ({
      text: item?.navigationTitle,
      title: item?.navigationTitle,
      url: item?.url,
      ariaLabel: item?.navigationTitle !== item?.title
        ? (item?.title ?? null)
        : null,
    }));
}

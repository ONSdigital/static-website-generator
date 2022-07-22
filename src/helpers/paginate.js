export default function paginate(page) {
  const pagination = page.pagination ?? { size: 1, data: [ null ] };
  const pageCount = Math.ceil(pagination.data.length / pagination.size);
  let dataPages = new Array(pageCount).fill()
    .map((_, pageIndex) => pagination.data.slice(pageIndex * pagination.size, (pageIndex + 1) * pagination.size));

  if (dataPages.length === 0 && pagination.generatePageOnEmptyData === true) {
    // Force page to exist by adding a page with no data.
    dataPages = [[]];
  }

  return dataPages.map((pageData, pageIndex) => {
    const paginatedPath = pageIndex === 0 ? "" : `/${pageIndex + 1}`;
    return {
      parent: null,
      children: [],

      ...page,

      id: (!!page.id?.replace) ? page.id.replace("%PAGE_INDEX%", pageIndex) : page.id,
      uri: page.uri + paginatedPath,
      url: page.url + paginatedPath,
      absoluteUrl: page.absoluteUrl + paginatedPath,

      pagination: {
        ...pagination,
        currentIndex: pageIndex,
        pages: dataPages.map((_, index) => ({
          url: page.url + (index === 0 ? "" : `/${index + 1}`),
          current: index === pageIndex,
        })),
      },

      [pagination.dataAlias ?? "data"]: pageData,
    };
  });
}

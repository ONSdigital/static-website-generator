import createStringReplacer from "../../helpers/createStringReplacer.js";
import escape from "../../helpers/escapeStringForRegExp.js";
import getInternalUrlRegex from "../../helpers/getInternalUrlRegex.js";
import resolveUrl from "../../helpers/resolveUrl.js";

export default function createHtmlContentFilter(data) {
  const internalUrlRegex = getInternalUrlRegex(data.site);
  const htmlFixer = createStringReplacer({
    // Process links.
    "(?<link>[<]a(?<linkAttributes>[^>]+)[>](?<linkText>[^]+?)[<][/]a[>])": (groups) => {
      const href = resolveUrl(groups.linkAttributes.match(/href="([^"]+)"/)?.[1], data);
      let target = groups.linkAttributes.match(/target="([^"]+)"/)?.[1];

      const isInternalLink = internalUrlRegex.test(href);
      if (!isInternalLink && !target) {
        target = "_blank";
      }

      if (target === "_blank") {
        const classNames = groups.linkAttributes.match(/class="([^"]+)"/)?.[1] ?? "";
        const otherAttributes = groups.linkAttributes.replace(/\s+(href|target|rel|class)="[^"]+"/g, "");

        return `<a href="${href}" class="ons-external-link ${classNames}" target="_blank" rel="noopener"${otherAttributes}>
          <span class="ons-external-link__text">${groups.linkText}</span><span class="ons-external-link__icon">&nbsp;<svg class="ons-icon" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
            <path d="M13.5,9H13a.5.5,0,0,0-.5.5v3h-9v-9h3A.5.5,0,0,0,7,3V2.5A.5.5,0,0,0,6.5,2h-4a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,13.5,9Z" transform="translate(-2 -1.99)" />
            <path d="M8.83,7.88a.51.51,0,0,0,.71,0l2.31-2.32,1.28,1.28A.51.51,0,0,0,14,6.49v-4a.52.52,0,0,0-.5-.5h-4A.51.51,0,0,0,9,2.52a.58.58,0,0,0,.14.33l1.28,1.28L8.12,6.46a.51.51,0,0,0,0,.71Z" transform="translate(-2 -1.99)" />
          </svg></span><span class="ons-external-link__new-window-description ons-u-vh"> (opens in a new tab)</span></a>&nbsp;`;
      }
      else {
        const otherAttributes = groups.linkAttributes.replace(/\s+(href)="[^"]+"/g, "");
        return `<a href="${href}"${otherAttributes}>${groups.linkText}</a>`;
      }
    },

    // Decorate table elements with ONS design system classes.
    [escape("<table>")]: '<div class="ons-table-scrollable__content"><table class="ons-table ons-table--scrollable">',
    [escape("</table>")]: '</table></div>',
    [escape("<caption>")]: '<caption class="ons-table__caption ons-u-fs-m ons-u-mb-s ons-u-mt-l">',
    [escape("<thead>")]: '<thead class="ons-table__head">',
    [escape("<tbody>")]: '<tbody class="ons-table__body">',
    [escape("<tr>")]: '<tr class="ons-table__row">',
    [escape("<th>")]: '<th class="ons-table__header" scope="col">',
    [escape("<td>")]: '<td class="ons-table__cell">',
  });

  return function htmlContentFilter(htmlContent) {
    let processedHtml = htmlFixer(htmlContent);

    processedHtml = processedHtml.replace(/<caption class="ons-table__caption ons-u-fs-m ons-u-mb-s ons-u-mt-l">(.*?)<\/caption>/g, (_, text) => {
      const slug = text.trim().toLowerCase().replace(/\s+/g, "-");
      return `<caption id="${slug}" class="ons-table__caption ons-u-fs-m u-mb-s ons-u-mt-l">${text}</caption>`;
    });

    return processedHtml;
  };
}

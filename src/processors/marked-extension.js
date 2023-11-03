export default function markedExtension() {
  let headingText;
  return {
    renderer: {
      heading(text) {
        headingText = text;
        return ''; 
      }, 
      table(header, body){
        const caption = headingText ? `<caption class="ons-table__caption ons-u-fs-m">${headingText}</caption>` : '';
        return `<table>
          ${caption}
          <thead>${header}</thead>
          <tbody>${body}</tbody>
        </table>`;
      }
    }
  };
}

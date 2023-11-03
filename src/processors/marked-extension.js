// This code defines a custom renderer that extends marked.js and overrides the table rendering method to include a <caption>. 
// You can learn more about custom renderer here at https://marked.js.org/using_pro#renderer
export default function markedExtension() {
  // Declare the heading text so it can be used globally
  let headingText;
  return {
    renderer: {
      // Custom renderer for headings
      heading(text) {
        // Set the heading text
        headingText = text;
      // Return an empty string to skip rendering the heading itself
        return ''; 
      },       
      // Custom renderer for tables
      table(header, body){
        // Check if there is heading text so we can add a caption
        const caption = headingText ? `<caption>${headingText}</caption>` : '';
        // Construct the table element with the optional caption
        return `<table>
          ${caption}
          <thead>${header}</thead>
          <tbody>${body}</tbody>
        </table>`;
      }
    }
  };
}

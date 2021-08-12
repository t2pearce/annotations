import './ColorSelector.css';
import './ShabeLabels.css';
/** A matching formatter that sets the color according to the 'highlighting' body value **/
var ColorFormatter = function(annotation) {
  const bodies = Array.isArray(annotation.body) ?
          annotation.body : [ annotation.body ];

        const firstTag = bodies.find(b => b.purpose == 'tagging');
  
      const firstComment = bodies.find(b => b.purpose == 'commenting');
        
        if (firstComment || firstTag) {
          const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');

          // Fill annotation dimensions
          foreignObject.setAttribute('width', '100%');
          foreignObject.setAttribute('height', '100%');

          foreignObject.innerHTML = `
            <div xmlns="http://www.w3.org/1999/xhtml" class="a9s-shape-label">
              ${firstComment.value}
            </div>`;

          return {
            element: foreignObject,
            className: firstComment.value
          };
        }
}
export default ColorFormatter;

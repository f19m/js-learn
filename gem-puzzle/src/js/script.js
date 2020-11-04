/* eslint-disable import/extensions */
import Puzzle from './Puzzle.js';

// document.body.addEventListener('mousemove', (evt) => {
//   console.log(`target: ${evt.target}; coord: ${evt.clientX}:${evt.clientY}`);
// });

// document.querySelector('.col15').addEventListener('mousedown', (evt) => {
//   const elem = evt.target.closest('.puzzle__col');
//   const height = `${elem.offsetHeight}px`;
//   const width = `${elem.offsetWidth}px`;
//   const shiftX = evt.clientX - elem.getBoundingClientRect().left;
//   const shiftY = evt.clientY - elem.getBoundingClientRect().top;

//   elem.classList.add('drag');

//   const field = document.querySelector('.puzzle__field');
//   field.appendChild(elem);

//   console.log(`height: ${height}; width: ${width}`);

//   elem.style;
//   const moveAt = function (pageX, pageY) {
//     elem.style.left = `${pageX - shiftX}px`;
//     elem.style.top = `${pageY - shiftY}px`;
//     // elem.style.left = `${pageX}px`;
//     // elem.style.top = `${pageY}px`;

//     elem.style.height = height;
//     elem.style.width = width;
//   };
//   moveAt(evt.pageX, evt.pageY);

//   const onMouseMove = function (event) {
//     moveAt(event.pageX, event.pageY);
//   };

//   document.addEventListener('mousemove', onMouseMove);

//   const onMouseUp = function () {
//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);
//   };
//   elem.addEventListener('mouseup', onMouseUp);
// });

document.addEventListener('DOMContentLoaded', () => {
  const puzzle = new Puzzle();
});

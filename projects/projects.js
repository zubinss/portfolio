import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });
d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

// let data = [1, 2];
// let total = 0;

// for (let d of data) {
//   total += d;
// }

// let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

// let arcs = arcData.map((d) => arcGenerator(d));

let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

// let colors = ['gold', 'purple'];
let colors = d3.scaleOrdinal(d3.schemeTableau10);
arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
})

let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
})

let query = '';

function setQuery(newQuery) {
    query = newQuery.toLowerCase(); 
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });
      return filteredProjects;
  }
  
  let searchInput = document.getElementsByClassName('searchBar')[0];
  
  searchInput.addEventListener('change', (event) => {
    let filteredProjects = setQuery(event.target.value);
    renderProjects(filteredProjects, projectsContainer, 'h2');
    // re-calculate rolled data
    let newRolledData = d3.rollups(
      filteredProjects,
      (v) => v.length,
      (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
      return {value: count, label: year }; // TODO
    });
    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    // TODO: clear up paths and legends
    d3.select('svg').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();

    // update paths and legends, refer to steps 1.4 and 2.2
    newArcs.forEach((arc, idx) => {
        d3.select('svg')
          .append('path')
          .attr('d', arc)
          .attr('fill', colors(idx));
      });
    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend.append('li')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
  });



//   5.2
  let selectedIndex = -1;
  for (let i = 0; i < arcs.length; i++) {
    const svgNS = "http://www.w3.org/2000/svg"; // to create <path> tag in memory
    let path = document.createElementNS(svgNS, "path");
    
    path.setAttribute("d", arcs[i]);
    path.setAttribute("fill", colors(i));
  
    path.addEventListener('click', (event) => {
      // What should we do?
      if (selectedIndex === i) {
        selectedIndex = -1; // Deselect
      } else {
        selectedIndex = i; // Select the clicked wedge
      }
    })
  
    let li = document.createElement('li');
    li.style.setProperty('--color', colors(i));
  
    // Create the swatch span
    let swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors(i);
    
    // Append the swatch to the list item
    li.appendChild(swatch);
  
    // Set the label and value
    li.innerHTML += `${data[i].label} <em>(${data[i].value})</em>`;
  
    legendNew.appendChild(li);
    svg.appendChild(path);
  }
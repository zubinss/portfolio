import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');

let selectedIndex = -1;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });
d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

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
let searchInput = document.querySelector('.searchBar');

function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
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
        .attr('class', idx === selectedIndex ? 'selected' : '')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

renderPieChart(projects);
  
  searchInput.addEventListener('change', (event) => {
    let filteredProjects = setQuery(event.target.value);
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
  });

  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        svg.selectAll('path').attr('class', (_, idx) => idx === selectedIndex ? 'selected' : 'wedge');
        legend.selectAll('li').attr('class', (_, idx) => idx === selectedIndex ? 'selected' : 'wedge');
        if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2');
        } 
        else {
            let selectedYear = data[selectedIndex].label; // Get the selected year
            let filteredProjects = projects.filter((project) => project.year === selectedYear);
            renderProjects(filteredProjects, projectsContainer, 'h2');
        }
    });
     
  });

  function setQuery(newQuery) {
    query = newQuery.toLowerCase(); 
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });
      return filteredProjects;
  }

  
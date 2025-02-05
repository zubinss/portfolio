console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
    <label class="color-scheme">
      Theme:
      <select id="theme-selector">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `
);

// navLinks = $$("nav a")

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add('current');
// Check if we're on localhost or GitHub Pages
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

let BASE_URL = '';

if (!IS_LOCAL) {
  BASE_URL = '/portfolio/';
}
else {
    BASE_URL = 'http://127.0.0.1:5500/';
  }

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/zubinss', title: 'GitHub' } ]


const ARE_WE_HOME = document.documentElement.classList.contains('home');


let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {

      url = BASE_URL + url;
    
  }

  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}

let currentPath = window.location.pathname.replace(/\/$/, ''); 
for (let link of nav.querySelectorAll('a')) {
  let linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
  if (linkPath === currentPath) {
    link.classList.add('current');
  }
}

let select = document.querySelector('select');

if ("colorScheme" in localStorage) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;  
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});


export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
  
    }
    const data = await response.json();
    return data; 


  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }

}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  for(let curr of project){
    const article = document.createElement('article');
    article.innerHTML = `
    <h3>${curr.title}</h3>
    <img src="${curr.image}" alt="${curr.title}">
    <div><p>${curr.description}</p>${curr.year}</div>
    
`;
    containerElement.appendChild(article);  
  }

}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}



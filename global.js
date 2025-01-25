console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

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
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
const IS_LOCAL = window.location.hostname === 'localhost';

// Define the base URL for the project
const BASE_URL = IS_LOCAL ? '/' : '/portfolio/';

// Array of pages with relative URLs and titles
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'about/', title: 'About' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/zubinss', title: 'GitHub' } // Full URL for external links
];

// Check if we're on the home page
const ARE_WE_HOME = document.documentElement.classList.contains('home');

// Create a <nav> element and add it to the beginning of <body>
let nav = document.createElement('nav');
document.body.prepend(nav);

// Loop through the pages and add links to the <nav>
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // If the URL is not an external link, add the base URL prefix
  if (!url.startsWith('http')) {
    url = BASE_URL + url;  // Prefix relative URLs with BASE_URL
  }

  // Add the link to the <nav>
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}

// Highlight the current page (optional)
let currentPath = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash
for (let link of nav.querySelectorAll('a')) {
  let linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
  if (linkPath === currentPath) {
    link.classList.add('current');
  }
}
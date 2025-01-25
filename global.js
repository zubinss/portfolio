console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// navLinks = $$("nav a")

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add('current');
const ROOT_PATH = '/portfolio/';
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/zubinss', title: 'Github' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // Adjust the URL for relative paths
    if (!url.startsWith('http')) {
      url = ROOT_PATH + url; // Prefix relative paths with the root path
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
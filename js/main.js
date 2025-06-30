const navButton = document.querySelector('#nav-toggler');
const navMenu = document.querySelector('#nav-menu');
const navCloseBtn = document.querySelector('#main-nav-close-btn');
const mainWrapper = document.querySelector('.main-wrapper');

navButton.addEventListener('click', showMainMenu);
navCloseBtn.addEventListener('click', hideMainMenu);

function showMainMenu(e) {
  navMenu.classList.add('menu-reveal');
  mainWrapper.classList.add('overflow-hidden');
  navButton.style.display = 'none';
}

function hideMainMenu(e) {
  navMenu.classList.remove('menu-reveal');
  mainWrapper.classList.remove('overflow-hidden');
  navButton.style.display = 'flex';
}

function ss() {
  const tt = ["text", "email", "search", "url"];
  for (const t of tt) {
    document.querySelectorAll(`[type="${t}"]`).forEach(x => {    
      x.value = x.value.replaceAll("<", " \lt ").replaceAll(">", " \gt ");
    });
  }  
  document.querySelectorAll('textarea').forEach(x => {
    x.value = x.value.replaceAll("<", " \lt ").replaceAll(">", " \gt ");
  });
}

function sf() {
  const f = document.querySelector('form');
  if (f) f.addEventListener('submit', e => {e.preventDefault(); ss(); e.target.submit();});
}

sf();

document.addEventListener("DOMContentLoaded", function () {

  const menuItems = document.querySelectorAll('.has-submenu > a');

  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener('click', function (e) {
      // Prevent the default link behavior
      e.preventDefault();
    });
  });
});

// If nav-menu is revealed, hide it when the user clicks outside of nav-menu 
// and target is not the nav-menu button
document.addEventListener('click', e => {
  if (navMenu.classList.contains('menu-reveal') 
      && e.target !== navButton
      && e.target !== navCloseBtn
      && e.target.closest('#nav-menu') === null) {
    hideMainMenu();
  }
});

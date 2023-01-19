let navMain = document.querySelector('.header-top__main-nav');
let navToggle = document.querySelector('.header-top__toggle');

navMain.classList.remove('header-top__main-nav--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('header-top__main-nav--closed')) {
    navMain.classList.remove('header-top__main-nav--closed');
    navMain.classList.add('header-top__main-nav--opened');
    navToggle.classList.remove('header-top__toggle--closed');
    navToggle.classList.add('header-top__toggle--opened');
  } else {
    navMain.classList.add('header-top__main-nav--closed');
    navMain.classList.remove('header-top__main-nav--opened');
    navToggle.classList.add('header-top__toggle--closed');
    navToggle.classList.remove('header-top__toggle--opened');
  }
});

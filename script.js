'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

// console.log(btnsOpenModal);
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Scrolling
btnScrollTo.addEventListener('click', function (e) {
  // const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  // // Scrolling
  // window.scrollTo(
  //   s1Coords.left + window.pageXOffset,
  //   s1Coords.top + window.pageYOffset
  // );

  // // Oldschool way
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (curEl) {
//   curEl.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(document.querySelector(id));
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

// 1. Add event listener to common parent element
// 2. Determine what element orginated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

///////////////////////////////////////
// Tabbed components
tabsContainer.addEventListener('click', function (e) {
  const btnClicked = e.target.closest('.operations__tab');
  // Guard clause
  if (!btnClicked) return;

  // Remove active classes
  tabs.forEach(function (t) {
    t.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(function (tc) {
    tc.classList.remove('operations__content--active');
  });

  // Active tab
  btnClicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${btnClicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (el) {
      if (el !== link) {
        el.style.opacity = this;
      }
    }, this);
    logo.style.opacity = this;
  }
};

// Passing an "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

///////////////////////////////////////
// Sliders
const slider = function () {
  const slides = document.querySelectorAll('.slide');

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(function (s, i) {
      // -100%, 0%, 100%, 200%
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      previousSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log(e.target);
      const slide = e.target.dataset.slide;
      // console.log(slide);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
// // Selecting Elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// console.log(document.getElementById('section--1'));
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookies for improved functionallity and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionallity and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// // header.prepend(message);
// header.append(message);
// // console.log(message.cloneNode(true));
// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);

// // Delete elemennts
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '100%';

// console.log(message.style.height);
// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);

// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';
// console.log(logo.alt);

// // Non-standard
// console.log(logo.desginer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c', 'j');
// logo.classList.contains('c', 'j');

// // Don't use (Overrides all classes)
// logo.className = 'jonas';

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading.');
// };
// h1.addEventListener('mouseenter', alertH1);
// setTimeout(fu, 3000);

// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading.');
// };

// rgb(255,255,255)

// const randomInt = function (min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };

// const randomColor = function () {
//   return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(
//     0,
//     255
//   )})`;
// };

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop propagation
//   // e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.currentTarget);
// });

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML Parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
// });

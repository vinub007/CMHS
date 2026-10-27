(function () {
  'use strict';

  if (document.querySelector('.quick-actions')) {
    return;
  }

  var items = [
    ['Home', 'index.html'],
    ['Our School', 'index.html#about'],
    ['Vision & Mission', 'vision-mission.html'],
    ['Academics', 'index.html#academics'],
    ['Admissions', 'index.html#admissions'],
    ['FAQs', 'faq.html'],
    ['Faculty', 'faculty.html'],
    ['Student Life', 'index.html#student-life'],
    ['Alumni', 'index.html#alumni'],
    ['News & Events', 'news-events.html'],
    ['Contact', 'index.html#contact'],
    ['Search', 'search.html']
  ];
  var nav = document.createElement('nav');
  nav.className = 'quick-actions';
  nav.setAttribute('aria-label', 'Quick actions');

  var call = document.createElement('a');
  call.href = 'tel:+919000232197';
  call.textContent = 'Call';
  nav.appendChild(call);

  var whatsapp = document.createElement('a');
  whatsapp.href = 'https://wa.me/919000232197?text=Hi%2C%20I%27m%20interested%20in%20admissions%20at%20Columbus%20Model%20High%20School%2C%20Miyapur.';
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener';
  whatsapp.textContent = 'WhatsApp';
  nav.appendChild(whatsapp);

  var visit = document.createElement('a');
  visit.href = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/'
    ? '#contact'
    : 'index.html#contact';
  visit.textContent = 'Visit';
  nav.appendChild(visit);

  var menu = document.createElement('details');
  var summary = document.createElement('summary');
  summary.textContent = 'Menu';
  menu.appendChild(summary);
  var menuItems = document.createElement('div');
  menuItems.className = 'quick-actions-menu';
  items.forEach(function (item) {
    var link = document.createElement('a');
    link.href = item[1];
    link.textContent = item[0];
    menuItems.appendChild(link);
  });
  menu.appendChild(menuItems);
  nav.appendChild(menu);
  document.body.appendChild(nav);
}());

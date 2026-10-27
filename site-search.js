(function () {
  'use strict';

  var pages = [
    'index.html',
    'primary-years.html',
    'middle-school.html',
    'high-school.html',
    'faculty.html',
    'news-events.html',
    'privacy.html',
    'accessibility.html'
  ];
  var form = document.getElementById('site-search-form');
  var input = document.getElementById('site-search-query');
  var status = document.getElementById('search-status');
  var results = document.getElementById('search-results');

  function normalize(value) {
    return value.toLocaleLowerCase('en-IN').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function readPage(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to search ' + path + ' (HTTP ' + response.status + ').');
      }
      return response.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var main = doc.querySelector('main') || doc.body;
      var description = doc.querySelector('meta[name="description"]');
      return {
        title: doc.title,
        path: path,
        text: normalize((description ? description.content : '') + ' ' + main.textContent)
      };
    });
  }

  function readFaculty() {
    return fetch('faculty.json').then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to search faculty profiles (HTTP ' + response.status + ').');
      }
      return response.json();
    }).then(function (content) {
      if (!content || !Array.isArray(content.staff)) {
        throw new Error('Faculty content must contain a staff array.');
      }
      return content.staff.filter(function (member) {
        return member && member.publish === true
          && String(member.name || '').trim()
          && String(member.role || '').trim()
          && String(member.subject || '').trim()
          && String(member.qualification || '').trim()
          && String(member.department || '').trim()
          && String(member.bio || '').trim();
      }).map(function (member) {
        return {
          title: String(member.name || 'Faculty profile'),
          path: 'faculty.html#faculty-profile-' + content.staff.indexOf(member),
          text: normalize([
            member.name, member.role, member.subject, member.qualification,
            member.department, member.bio
          ].filter(Boolean).join(' '))
        };
      });
    });
  }

  function render(matches) {
    results.replaceChildren();
    matches.forEach(function (match) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      var excerpt = document.createElement('p');
      link.href = match.path;
      link.textContent = match.title;
      excerpt.textContent = match.excerpt;
      item.append(link, excerpt);
      results.appendChild(item);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var query = normalize(input.value.trim());
    if (!query) {
      status.textContent = 'Enter a search term.';
      results.replaceChildren();
      input.focus();
      return;
    }

    status.textContent = 'Searching published pages…';
    results.replaceChildren();
    Promise.all([Promise.all(pages.map(readPage)), readFaculty()]).then(function (data) {
      var documents = data[0].concat(data[1]);
      var terms = query.split(/\s+/).filter(Boolean);
      var matches = documents.map(function (document) {
        var score = terms.reduce(function (total, term) {
          return total + (document.text.indexOf(term) !== -1 ? 1 : 0);
        }, 0);
        return { document: document, score: score };
      }).filter(function (result) {
        return result.score === terms.length;
      }).sort(function (a, b) {
        return b.score - a.score || a.document.title.localeCompare(b.document.title);
      }).map(function (result) {
        var index = result.document.text.indexOf(terms[0]);
        var excerpt = index < 0 ? result.document.title : result.document.text.slice(Math.max(0, index - 70), index + 170);
        return {
          title: result.document.title,
          path: result.document.path,
          excerpt: excerpt
        };
      });

      render(matches);
      status.textContent = matches.length
        ? matches.length + ' matching page' + (matches.length === 1 ? '' : 's') + '.'
        : 'No matching pages were found. Try a different search term or contact the school.';
    }).catch(function (error) {
      console.error('Website search failed:', error);
      status.textContent = 'Search is temporarily unavailable. Browse the site or contact the school.';
    });
  });

  var initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery) {
    input.value = initialQuery;
    form.requestSubmit();
  }
}());

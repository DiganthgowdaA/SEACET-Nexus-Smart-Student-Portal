'use strict';
/* ================================================
   SEACET Nexus — Global Search
   ================================================ */
const SearchEngine = (() => {
  const registry = {};
  let activeIndex = -1;
  let debounceTimer = null;

  const register = (category, items) => { registry[category] = items; };

  const search = (query, category = 'all') => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    let results = [];
    const cats = category === 'all' ? Object.keys(registry) : [category];
    cats.forEach(cat => {
      if (!registry[cat]) return;
      registry[cat].forEach(item => {
        const text = (item.title + ' ' + (item.description || '') + ' ' + (item.tags || [])).toLowerCase();
        if (text.includes(q)) {
          results.push({ ...item, category: cat, relevance: text.indexOf(q) });
        }
      });
    });
    results.sort((a, b) => a.relevance - b.relevance);
    return results.slice(0, 20);
  };

  const highlight = (text, query) => {
    if (!query) return text;
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<span class="search-highlight">$1</span>');
  };

  const renderResults = (results, query) => {
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (results.length === 0) {
      container.innerHTML = `<div class="search-empty"><p>No results found for "${query}"</p></div>`;
      return;
    }
    activeIndex = -1;
    container.innerHTML = results.map((r, i) => `
      <a href="${r.url || '#'}" class="search-result-item" data-index="${i}">
        <div class="result-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <div class="result-text">
          <div class="result-title">${highlight(r.title, query)}</div>
          <div class="result-category">${r.category}</div>
        </div>
      </a>
    `).join('');
  };

  const init = () => {
    /* Register searchable data */
    register('faculty', [
      { title: 'Dr. Rajesh Kumar', description: 'HOD CSE AI ML', url: 'pages/faculty.html' },
      { title: 'Dr. Priya Sharma', description: 'CSE Data Science', url: 'pages/faculty.html' },
      { title: 'Prof. Anand Verma', description: 'ISE Web Technologies', url: 'pages/faculty.html' },
      { title: 'Dr. Kavitha R', description: 'HOD ISE Cloud', url: 'pages/faculty.html' },
      { title: 'Dr. Suresh Babu', description: 'HOD ECE VLSI', url: 'pages/faculty.html' },
      { title: 'Dr. Mohammed Farhan', description: 'HOD AI ML Deep Learning', url: 'pages/faculty.html' },
    ]);
    register('events', [
      { title: 'Hackathon 2026', description: 'coding challenge Aug 5-6', url: 'pages/events.html' },
      { title: 'Cultural Fest Reverie', description: 'music dance drama Aug 15', url: 'pages/events.html' },
      { title: 'IEEE Tech Talk', description: 'quantum computing seminar', url: 'pages/events.html' },
      { title: 'Cloud Computing Workshop', description: 'AWS hands-on', url: 'pages/events.html' },
      { title: 'Sports Day 2026', description: 'inter-department athletics', url: 'pages/events.html' },
    ]);
    register('notes', [
      { title: 'Data Structures & Algorithms', description: '3rd Sem CSE', url: 'pages/notes.html' },
      { title: 'Database Management Systems', description: '4th Sem CSE', url: 'pages/notes.html' },
      { title: 'Operating Systems', description: '5th Sem CSE', url: 'pages/notes.html' },
      { title: 'Machine Learning', description: '7th Sem AI ML', url: 'pages/notes.html' },
      { title: 'Computer Networks', description: '5th Sem CSE ISE', url: 'pages/notes.html' },
      { title: 'Web Technologies', description: '4th Sem ISE', url: 'pages/notes.html' },
    ]);
    register('clubs', [
      { title: 'IEEE Student Branch', description: 'technical paper presentation', url: 'pages/clubs.html' },
      { title: 'CSI Chapter', description: 'coding contest webinar', url: 'pages/clubs.html' },
      { title: 'NSS Unit', description: 'community service social', url: 'pages/clubs.html' },
      { title: 'Coding Club', description: 'competitive programming DSA', url: 'pages/clubs.html' },
      { title: 'Photography Club', description: 'photo walks exhibitions', url: 'pages/clubs.html' },
    ]);
    register('placements', [
      { title: 'Infosys', description: '4.5 LPA Systems Engineer', url: 'pages/placements.html' },
      { title: 'Wipro', description: '3.8 LPA Project Engineer', url: 'pages/placements.html' },
      { title: 'TCS', description: '3.6 LPA Ninja Digital', url: 'pages/placements.html' },
      { title: 'Amazon', description: '12 LPA SDE-I', url: 'pages/placements.html' },
      { title: 'Microsoft', description: '11 LPA Software Engineer', url: 'pages/placements.html' },
      { title: 'Deloitte', description: '7.5 LPA Analyst', url: 'pages/placements.html' },
    ]);
    register('scholarships', [
      { title: 'Post Matric Scholarship', description: 'Government Karnataka SC/ST', url: '#scholarships' },
      { title: 'Merit Scholarship', description: 'SEACET top performers', url: '#scholarships' },
      { title: 'AICTE Pragati', description: 'Girl students engineering', url: '#scholarships' },
    ]);

    /* Search input listener */
    const input = document.getElementById('globalSearch');
    if (input) {
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const activeCat = document.querySelector('.search-cat.active');
          const cat = activeCat ? activeCat.dataset.cat : 'all';
          const results = search(input.value, cat);
          renderResults(results, input.value);
        }, 300);
      });
    }

    /* Category buttons */
    document.querySelectorAll('.search-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.search-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (input && input.value) {
          const results = search(input.value, btn.dataset.cat);
          renderResults(results, input.value);
        }
      });
    });
  };

  return { init, search, register };
})();

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');

if (toggle && drawer) {
  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Basic form validation
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', e => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'rgba(239,68,68,0.6)';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) { e.preventDefault(); form.querySelector('[required]:invalid')?.focus(); }
  });
}

// Set active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

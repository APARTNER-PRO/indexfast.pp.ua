document.addEventListener('DOMContentLoaded', () => {
  // Back to Top functionality
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // TOC ScrollSpy
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (tocLinks.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-100px 0px -60% 0px' });

    tocLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) observer.observe(targetElement);
      }
    });
  }

  // Dynamic Language Switcher
  // Extracts filename from /blog/article.html or /uk/blog/article.html
  // and rebuilds each language link to point to the same article
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const blogIdx = pathParts.lastIndexOf('blog');
  const filename = (blogIdx >= 0 && pathParts[blogIdx + 1]) ? pathParts[blogIdx + 1] : null;

  if (filename) {
    const langMap = {
      'English':    '/blog/' + filename,
      'Українська': '/uk/blog/' + filename,
      'Español':    '/es/blog/' + filename,
      'Português':  '/pt/blog/' + filename,
      'Русский':    '/ru/blog/' + filename,
      'Deutsch':    '/de/blog/' + filename,
      'Français':   '/fr/blog/' + filename,
      'Polski':     '/pl/blog/' + filename,
    };

    document.querySelectorAll('.nav-lang-menu a').forEach(function(a) {
      var label = a.textContent.trim();
      if (langMap[label]) {
        a.href = langMap[label];
      }
    });
  }

  // Navbar scroll effect
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }
});

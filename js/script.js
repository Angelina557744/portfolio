document.addEventListener('DOMContentLoaded', () => {

  /* ========== КОПИРОВАНИЕ EMAIL ========== */
  document.querySelectorAll('.copy-email').forEach(button => {
    button.addEventListener('click', async () => {
      const email = button.dataset.email;
      const originalText = button.textContent;

      try {
        await navigator.clipboard.writeText(email);
        button.textContent = 'Скопировано ✓';
        button.classList.add('is-copied');

        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('is-copied');
        }, 2000);
      } catch (err) {
        button.textContent = email;
      }
    });
  });

  /* ========== ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ========== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
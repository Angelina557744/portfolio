document.addEventListener('DOMContentLoaded', () => {

  /* ========== КОПИРОВАНИЕ EMAIL ========== */
  const copyButtons = document.querySelectorAll('.copy-email');

  copyButtons.forEach(button => {
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

  /* ========== ХЕДЕР: БЛЮР ПРИ СКРОЛЛЕ ========== */
  const header = document.querySelector('.header');
  const onScrollHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ========== ПРОГРЕСС-БАР СКРОЛЛА ========== */
  const progress = document.querySelector('.progress');
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.transform = `scaleX(${scrolled})`;
  };
  window.addEventListener('scroll', onScrollProgress, { passive: true });
  onScrollProgress();

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

  /* ========== ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ========== */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    // Добавляем класс .reveal ко всем проектам, группам навыков, секциям
    const toReveal = document.querySelectorAll(
      '.project, .skills__group, .section__head, .cta__inner, .stat'
    );
    toReveal.forEach(el => el.classList.add('reveal'));

    // IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Небольшая задержка для stagger-эффекта
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    toReveal.forEach(el => observer.observe(el));
  } else {
    // Если пользователь отключил анимации — показываем всё сразу
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ========== ПАРАЛЛАКС ФОТО В КАРТОЧКАХ ========== */
  if (!prefersReduced) {
    const projectImages = document.querySelectorAll('.project__image img');

    const onScrollParallax = () => {
      projectImages.forEach(img => {
        const rect = img.parentElement.getBoundingClientRect();
        const vh = window.innerHeight;

        // Считаем прогресс: 0 — когда карточка внизу экрана, 1 — когда вверху
        const progress = 1 - (rect.top + rect.height) / (vh + rect.height);

        if (progress >= -0.2 && progress <= 1.2) {
          // Смещение от -15px до +15px
          const shift = (progress - 0.5) * 30;
          img.style.transform = `scale(1.06) translateY(${shift}px)`;
        }
      });
    };

    window.addEventListener('scroll', onScrollParallax, { passive: true });
    onScrollParallax();
  }

  /* ========== ХОВЕР-ЭФФЕКТ НА КАРТОЧКЕ ПРОЕКТА ========== */
  // (уже реализован через CSS, но добавим лёгкий 3D-tilt на featured)
  const featured = document.querySelector('.project--featured');
  if (featured && !prefersReduced && window.innerWidth > 900) {
    featured.addEventListener('mousemove', (e) => {
      const rect = featured.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      featured.style.transform = `translateY(-6px) perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });

    featured.addEventListener('mouseleave', () => {
      featured.style.transform = '';
    });
  }

  /* ========== КАСТОМНЫЙ КУРСОР (только десктоп) ========== */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches && window.innerWidth > 768) {
    // Создаём элементы курсора
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('pointermove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });

    // Плавное следование кольца
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    // Реакция на интерактивные элементы
    document.addEventListener('pointerover', (e) => {
      const target = e.target.closest('a, button, .project');
      if (target) {
        ring.classList.add('is-big');
        dot.style.opacity = '0';
      }
    });

    document.addEventListener('pointerout', (e) => {
      const target = e.target.closest('a, button, .project');
      if (target) {
        ring.classList.remove('is-big');
        dot.style.opacity = '1';
      }
    });
  }

  /* ========== АНИМАЦИЯ ЗАГОЛОВКА HERO ПО БУКВАМ ========== */
  if (!prefersReduced) {
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      const lines = heroTitle.querySelectorAll('.line');
      lines.forEach((line, i) => {
        const text = line.innerHTML;
        // Разбиваем только текстовые узлы, сохраняя span.accent
        line.style.opacity = '0';
        line.style.transform = 'translateY(40px)';
        line.style.transition = `opacity .9s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s, transform .9s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s`;
        requestAnimationFrame(() => {
          setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'none';
          }, 100);
        });
      });
    }
  }

  /* ========== СЧЁТЧИКИ В HERO ========== */
  if (!prefersReduced) {
    const stats = document.querySelectorAll('.stat b');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const finalText = el.textContent.trim();
          const num = parseInt(finalText);
          if (isNaN(num)) return;

          const suffix = finalText.replace(/[0-9]/g, ''); // "+" или "%" или ""
          let current = 0;
          const duration = 1200;
          const start = performance.now();

          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(eased * num);
            el.textContent = current + suffix;

            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = finalText;
          };

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
  }

});
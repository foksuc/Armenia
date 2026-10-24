(() => {
  const mapUrl = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  document.querySelectorAll('[data-map]').forEach(link => {
    link.href = mapUrl(link.dataset.map);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', `${link.textContent.trim()} — открыть Google Maps`);
  });

  const menu = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    menu.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
    mobileNav.hidden = open;
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Открыть меню');
  }));

  const photos = {
    garni: {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Temple_of_Garni_%2829365546500%29.jpg?width=1920',
      alt: 'Храм Гарни в Армении',
      caption: 'Храм Гарни · фото Clay Gilliland / Wikimedia Commons, CC BY-SA 2.0'
    },
    khor: {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khor_Virap_-_Armenia_%282911406199%29.jpg?width=1920',
      alt: 'Монастырь Хор Вирап на фоне гор',
      caption: 'Хор Вирап · фото Rita Willaert / Wikimedia Commons, CC BY 2.0'
    }
  };
  const lightbox = document.querySelector('#lightbox');
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('p');
  let returnFocus = null;
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    const photo = photos[button.dataset.photo];
    if (!photo) return;
    returnFocus = button;
    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.caption;
    lightbox.hidden = false;
    document.body.classList.add('locked');
    lightbox.querySelector('.lightbox-close').focus();
  }));
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('locked');
    image.removeAttribute('src');
    returnFocus?.focus();
  };
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    if (e.key === 'Tab' && !lightbox.hidden) {
      e.preventDefault();
      lightbox.querySelector('.lightbox-close').focus();
    }
  });

  const budgetButtons = document.querySelectorAll('[data-budget-route]');
  budgetButtons.forEach(button => button.addEventListener('click', () => {
    const sochi = button.dataset.budgetRoute === 'sochi';
    budgetButtons.forEach(other => {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#flight-total').textContent = sochi ? '15 689 ₽' : '16 819 ₽';
    document.querySelector('#budget-total').textContent = sochi ? '≈ 53 900–58 900 ₽' : '≈ 55 100–60 100 ₽';
  }));

  if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-photo', { scale: 1.12, duration: 1.8, ease: 'power2.out' });
    gsap.from('.hero-content > *', { y: 35, opacity: 0, duration: 1, stagger: 0.16, ease: 'power3.out' });
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.from(el, { y: 32, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  }
})();

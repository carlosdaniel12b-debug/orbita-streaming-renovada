/* Shared chrome: immediate input, bounded motion, no dependency on animation completion. */
(()=>{'use strict';
 const header=document.querySelector('.header');
 let frame=0;
 const update=()=>{header?.classList.toggle('scrolled',scrollY>24);frame=0;};
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});update();
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
 const desktop=matchMedia('(min-width:901px)');
 desktop.addEventListener('change',()=>{if(desktop.matches&&nav?.classList.contains('open'))menu?.click();});
 document.querySelectorAll('.pearl-faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.pearl-faq-list details[open]').forEach(other=>{if(other!==item)other.open=false;});}));

  // Hero Filmstrip Carousel con auto-play y navegación orbital
  const filmstrip = document.getElementById('pearl-filmstrip');
  const track = document.getElementById('film-track');
  const prevBtn = document.getElementById('film-prev');
  const nextBtn = document.getElementById('film-next');
  const dotsContainer = document.getElementById('film-dots');

  if (track && filmstrip) {
    const slides = Array.from(track.querySelectorAll('.pearl-film-slide'));
    let currentIndex = 0;
    let autoPlayTimer = null;
    let isHovered = false;

    // Crear puntos de navegación
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a diapositiva ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const updateDots = (index) => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    };

    const getSlideWidth = () => {
      const slide = slides[0];
      if (!slide) return 320;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 22;
      return slide.offsetWidth + gap;
    };

    const goToSlide = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      const scrollPos = index * getSlideWidth();
      track.scrollTo({ left: scrollPos, behavior: 'smooth' });
      updateDots(currentIndex);
    };

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });

    // Clicks en diapositivas llevan a descubre.html
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const title = slide.querySelector('h3')?.textContent?.trim() || '';
        window.location.href = 'descubre.html' + (title ? '?q=' + encodeURIComponent(title) : '');
      });
    });

    // Detectar scroll manual
    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const slideWidth = getSlideWidth();
        const index = Math.round(track.scrollLeft / slideWidth);
        if (index >= 0 && index < slides.length && index !== currentIndex) {
          currentIndex = index;
          updateDots(currentIndex);
        }
      }, 80);
    }, { passive: true });

    // Autoplay cada 4.5 segundos
    const startAutoPlay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        if (!isHovered && !document.hidden) {
          goToSlide(currentIndex + 1);
        }
      }, 4500);
    };

    const resetAutoPlay = () => {
      startAutoPlay();
    };

    filmstrip.addEventListener('mouseenter', () => { isHovered = true; });
    filmstrip.addEventListener('mouseleave', () => { isHovered = false; });
    filmstrip.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
    filmstrip.addEventListener('touchend', () => { setTimeout(() => { isHovered = false; }, 2000); });

    startAutoPlay();
  }
})();

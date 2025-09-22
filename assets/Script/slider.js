(function () {
  function initSlider(container) {
    const imgs = Array.from(container.querySelectorAll(':scope > img'));
    if (imgs.length <= 1) return;

    const slides = imgs.map((img) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'slide';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      return wrapper;
    });

    let index = 0;
    slides[0].classList.add('active');

    const prev = document.createElement('button');
    prev.className = 'nav prev';
    prev.setAttribute('aria-label', 'Anterior');
    prev.textContent = '<';

    const next = document.createElement('button');
    next.className = 'nav next';
    next.setAttribute('aria-label', 'Próxima');
    next.textContent = '>';

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'dots';
    const dots = slides.map((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    container.appendChild(prev);
    container.appendChild(next);
    container.appendChild(dotsWrap);

    function goTo(i) {
      slides[index].classList.remove('active');
      dots[index].classList.remove('active');
      index = (i + slides.length) % slides.length;
      slides[index].classList.add('active');
      dots[index].classList.add('active');
    }

    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));

    let startX = 0;
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    container.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      if (Math.abs(dx) > 30) {
        if (dx > 0) goTo(index - 1);
        else goTo(index + 1);
      }
    });
  }

  function groupImagesInSections() {
    const sections = document.querySelectorAll('.chapters section');
    sections.forEach((sec) => {
      const children = Array.from(sec.children);
      let run = [];
      const flush = () => {
        if (run.length >= 2) {
          const slider = document.createElement('div');
          slider.className = 'image-slider';
          run[0].parentNode.insertBefore(slider, run[0]);
          run.forEach((img) => slider.appendChild(img));
        }
        run = [];
      };
      children.forEach((el) => {
        if (el.tagName === 'IMG') {
          run.push(el);
        } else {
          flush();
        }
      });
      flush();
    });
  }

  function initAll() {
    groupImagesInSections();
    document.querySelectorAll('.image-slider').forEach(initSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

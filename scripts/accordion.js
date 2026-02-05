document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-accordion').forEach(accordion => {
    const items = accordion.querySelectorAll('.js-accordion-item');

    items.forEach(item => {
      const header = item.querySelector('.js-accordion-header');
      if (!header) return;

      header.addEventListener('click', () => {
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('is-open');
          }
        });
        item.classList.toggle('is-open');
      });
    });
  });
});
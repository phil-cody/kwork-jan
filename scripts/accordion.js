document.addEventListener('DOMContentLoaded', () => {
	const accordionHeaders = document.querySelectorAll('.js-accordion-header');

	if (accordionHeaders.length > 0) {
		accordionHeaders.forEach(header => {
			header.addEventListener('click', () => {
				const item = header.closest('.js-accordion-item');
				if (item) {
					item.classList.toggle('is-open');
				}
			});
		});
	}
});

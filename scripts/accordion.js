document.addEventListener('DOMContentLoaded', () => {
	const accordionHeaders = document.querySelectorAll('.js-accordion-header');

	if (accordionHeaders.length > 0) {
		accordionHeaders.forEach(header => {
			header.addEventListener('click', () => {
				const item = header.closest('.js-accordion-item');
				if (item) {
					const faqItems = document.querySelectorAll('.js-accordion-item');
					faqItems.forEach(otherItem => {
						if (otherItem !== item) {
							otherItem.classList.remove('is-open');
						}
					});
					item.classList.toggle('is-open');
				}
			});
		});
	}
});

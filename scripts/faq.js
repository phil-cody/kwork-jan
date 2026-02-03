document.addEventListener('DOMContentLoaded', () => {
	const faqItems = document.querySelectorAll('.faq__content li');

	if (faqItems.length > 0) {
		faqItems.forEach(item => {
			const header = item.querySelector('.faq__item-header');

			if (header) {
				header.addEventListener('click', () => {
					// Закрыть другие элементы
					faqItems.forEach(otherItem => {
						if (otherItem !== item) {
							otherItem.classList.remove('is-open');
						}
					});

					// Переключить текущий элемент
					item.classList.toggle('is-open');
				});
			}
		});
	}
});

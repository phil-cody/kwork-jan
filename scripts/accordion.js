document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.js-accordion').forEach(accordion => {
		const items = accordion.querySelectorAll('.js-accordion-item');

		items.forEach(item => {
			const header = item.querySelector('.js-accordion-header');
			if (!header) return;

			header.addEventListener('click', () => {
				const isOpen = item.classList.contains('is-open');

				// закрываем все
				items.forEach(i => i.classList.remove('is-open'));

				// если был закрыт — открываем
				if (!isOpen) {
					item.classList.add('is-open');
				}
			});
		});
	});
});
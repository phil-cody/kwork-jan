document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.js-accordion').forEach(accordion => {
		const items = accordion.querySelectorAll('.js-accordion-item');

		items.forEach(item => {
			const header = item.querySelector('.js-accordion-header');
			const content = Array.from(item.children)
				.find(el => !el.classList.contains('js-accordion-header'));

			if (!header || !content) return;

			// начальное состояние
			if (item.classList.contains('is-open')) {
				content.style.height = content.scrollHeight + 'px';
			} else {
				content.style.height = '0px';
			}

			header.addEventListener('click', () => {
				const isOpen = item.classList.contains('is-open');

				// закрываем все остальные
				items.forEach(i => {
					if (i === item) return;

					i.classList.remove('is-open');

					const c = Array.from(i.children)
						.find(el => !el.classList.contains('js-accordion-header'));

					if (!c) return;

					c.style.height = c.scrollHeight + 'px';
					requestAnimationFrame(() => {
						c.style.height = '0px';
					});
				});

				if (isOpen) {
					// закрытие текущего
					content.style.height = content.scrollHeight + 'px';
					requestAnimationFrame(() => {
						content.style.height = '0px';
					});
					item.classList.remove('is-open');
				} else {
					// открытие текущего
					item.classList.add('is-open');
					content.style.height = content.scrollHeight + 'px';
				}
			});
		});
	});
});
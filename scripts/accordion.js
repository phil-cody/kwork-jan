document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.js-accordion').forEach(accordion => {
		const items = accordion.querySelectorAll('.js-accordion-item');

		items.forEach(item => {
			const header = item.querySelector('.js-accordion-header');
			const content = Array.from(item.children)
				.find(el => !el.classList.contains('js-accordion-header'));

			if (!header || !content) return;

			// init
			if (item.classList.contains('is-open')) {
				content.style.height = content.scrollHeight + 'px';
			} else {
				content.style.height = '0px';
			}

			header.addEventListener('click', () => {
				const isOpen = item.classList.contains('is-open');

				// закрываем остальные
				items.forEach(other => {
					if (other === item) return;

					const otherContent = Array.from(other.children)
						.find(el => !el.classList.contains('js-accordion-header'));

					if (!otherContent || !other.classList.contains('is-open')) return;

					otherContent.style.height = otherContent.scrollHeight + 'px';
					requestAnimationFrame(() => {
						otherContent.style.height = '0px';
					});

					other.classList.remove('is-open');
				});

				if (isOpen) {
					// ПЛАВНОЕ ЗАКРЫТИЕ
					content.style.height = content.scrollHeight + 'px';
					requestAnimationFrame(() => {
						content.style.height = '0px';
					});

					item.classList.remove('is-open');
				} else {
					// ПЛАВНОЕ ОТКРЫТИЕ
					item.classList.add('is-open');
					content.style.height = content.scrollHeight + 'px';
				}
			});
		});
	});
});
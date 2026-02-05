document.addEventListener('DOMContentLoaded', () => {
	const payments = document.querySelector('.payments');
	const categoryButtons = document.querySelectorAll('.payments__category-button');
	const categorySections = document.querySelectorAll('.payments__category-section');
	const categoryHeaders = document.querySelectorAll('.payments__category-header');
	const cityToggle = document.querySelector('.payments__city-toggle');
	const cityDropdown = document.querySelector('.payments__city-dropdown');
	const cityOptions = document.querySelectorAll('.payments__city-option');

	let currentCity = 'moscow';

	function syncCategoryButtons() {
		const activeCategory = payments.className
			.split(' ')
			.find(cls => cls.startsWith('category-'))
			?.replace('category-', '');

		const visibleButtons = document.querySelectorAll(
			`.payments__header-category[data-city="${currentCity}"] .payments__category-button`
		);

		let hasActive = false;

		visibleButtons.forEach(button => {
			const isActive = button.dataset.category === activeCategory;
			button.classList.toggle('btn--primary', isActive);
			button.classList.toggle('btn--outlined', !isActive);
			if (isActive) hasActive = true;
		});

		if (!hasActive && visibleButtons.length) {
			const firstButton = visibleButtons[0];
			firstButton.classList.add('btn--primary');
			firstButton.classList.remove('btn--outlined');

			payments.classList.remove(
				'category-payments',
				'category-injuries',
				'category-family',
				'category-additional'
			);
			payments.classList.add(`category-${firstButton.dataset.category}`);
		}
	}

	function updateContentByCity(city) {
		currentCity = city;

		payments.classList.remove('city-moscow', 'city-other');
		payments.classList.add(`city-${city}`);

		categorySections.forEach(section => {
			section.classList.remove('active');
			const content = section.querySelector('.payments__category-content');
			if (content) content.classList.remove('active');
		});
	}

	categorySections.forEach(section => {
		section.classList.remove('active');
		const content = section.querySelector('.payments__category-content');
		if (content) content.classList.remove('active');
	});

	categoryButtons.forEach(button => {
		button.addEventListener('click', () => {
			const category = button.dataset.category;

			payments.classList.remove(
				'category-payments',
				'category-injuries',
				'category-family',
				'category-additional'
			);
			payments.classList.add(`category-${category}`);

			categoryButtons.forEach(btn => {
				btn.classList.toggle('btn--primary', btn === button);
				btn.classList.toggle('btn--outlined', btn !== button);
			});

			categorySections.forEach(section => {
				section.classList.remove('active');
				const content = section.querySelector('.payments__category-content');
				if (content) content.classList.remove('active');
			});
		});
	});

	cityOptions.forEach(option => {
		option.addEventListener('click', () => {
			const city = option.dataset.city;

			cityOptions.forEach(o => o.classList.remove('active'));
			option.classList.add('active');

			cityToggle.querySelector('span').textContent = option.textContent;

			cityToggle.classList.remove('active');
			cityDropdown.classList.remove('active');

			updateContentByCity(city);
			syncCategoryButtons();
		});
	});

	cityToggle.addEventListener('click', e => {
		e.stopPropagation();
		cityToggle.classList.toggle('active');
		cityDropdown.classList.toggle('active');
	});

	document.addEventListener('click', e => {
		if (!cityToggle.contains(e.target)) {
			cityToggle.classList.remove('active');
			cityDropdown.classList.remove('active');
		}
	});

	categoryHeaders.forEach(header => {
		header.addEventListener('click', () => {
			const currentSection = header.closest('.payments__category-section');
			const currentCity = currentSection.dataset.city;
			const currentContent = currentSection.querySelector('.payments__category-content');

			categorySections.forEach(section => {
				const content = section.querySelector('.payments__category-content');

				if (section.dataset.city === currentCity) {
					if (section === currentSection) {
						section.classList.toggle('active');
						content.classList.toggle('active');
					} else {
						section.classList.remove('active');
						content.classList.remove('active');
					}
				}
			});
		});
	});

	updateContentByCity(currentCity);
	payments.classList.add('category-payments');
	syncCategoryButtons();

	categoryButtons.forEach(btn => {
		btn.classList.toggle('btn--primary', btn.dataset.category === 'payments');
		btn.classList.toggle('btn--outlined', btn.dataset.category !== 'payments');
	});
});
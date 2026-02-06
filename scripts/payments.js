document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('.payments');
	if (!root) return;

	const cityOptions = root.querySelectorAll('.payments__city-option');
	const cityToggleText = root.querySelector('.payments__city-toggle span');

	const headerGroups = root.querySelectorAll('.payments__header-category');
	const categoryButtons = root.querySelectorAll('.payments__category-button');
	const categorySections = root.querySelectorAll('.payments__category-section');

	const MOBILE_BREAKPOINT = 540;

	let currentCityIndex = 0;
	let currentCategoryIndex = 0;

	const cityToggle = root.querySelector('.payments__city-toggle');
	const cityDropdown = root.querySelector('.payments__city-dropdown');

	cityToggle.addEventListener('click', e => {
		e.stopPropagation();
		cityToggle.classList.toggle('active');
		cityDropdown.classList.toggle('active');
	});

	cityOptions.forEach(option => {
		option.addEventListener('click', e => {
			e.stopPropagation();

			currentCityIndex = Number(option.dataset.cityIndex);

			currentCategoryIndex = findFirstCategoryIndexForCity(currentCityIndex);

			cityOptions.forEach(o => o.classList.remove('active'));
			option.classList.add('active');

			cityToggleText.textContent = option.textContent;

			cityToggle.classList.remove('active');
			cityDropdown.classList.remove('active');

			categorySections.forEach(section => {
				section.classList.remove('is-open');
			});

			updateView();
		});
	});

	document.addEventListener('click', () => {
		cityToggle.classList.remove('active');
		cityDropdown.classList.remove('active');
	});

	function syncAccordionState() {
		if (window.innerWidth > MOBILE_BREAKPOINT) return;

		categorySections.forEach(section => {
			const cityMatch =
				Number(section.dataset.cityIndex) === currentCityIndex;
			const categoryMatch =
				Number(section.dataset.categoryIndex) === currentCategoryIndex;

			section.classList.toggle(
				'is-open',
				cityMatch && categoryMatch
			);
		});
	}

	function updateView() {
		const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

		headerGroups.forEach(group => {
			group.classList.toggle(
				'active',
				!isMobile && Number(group.dataset.cityIndex) === currentCityIndex
			);
		});

		categorySections.forEach(section => {
			const cityMatch =
				Number(section.dataset.cityIndex) === currentCityIndex;
			const categoryMatch =
				Number(section.dataset.categoryIndex) === currentCategoryIndex;

			if (isMobile) {
				section.classList.toggle('is-visible', cityMatch);
			} else {
				section.classList.toggle('active', cityMatch && categoryMatch);
			}
		});

		if (isMobile) {
			section.classList.remove('is-visible', 'is-open');

			if (cityMatch) {
				section.classList.add('is-visible');
			}
	}

		syncAccordionState();
	}

	const headers = root.querySelectorAll('.payments__category-header');

	headers.forEach(header => {
	header.addEventListener('click', () => {
		if (window.innerWidth > MOBILE_BREAKPOINT) return;

		const section = header.closest('.payments__category-section');
		if (!section) return;

		const categoryIndex = Number(section.dataset.categoryIndex);
		const isOpen = section.classList.contains('is-open');

		// закрываем все остальные
		categorySections.forEach(sec => {
			if (sec !== section && sec.classList.contains('is-visible')) {
				sec.classList.remove('is-open');
			}
		});

		if (isOpen) {
			section.classList.remove('is-open');
		} else {
			currentCategoryIndex = categoryIndex;
			section.classList.add('is-open');
		}
	});
});

	function findFirstCategoryIndexForCity(cityIndex) {
		const section = Array.from(categorySections).find(
			el => Number(el.dataset.cityIndex) === cityIndex
		);
		return section ? Number(section.dataset.categoryIndex) : 0;
	}

	categoryButtons.forEach(button => {
		button.addEventListener('click', () => {
			const parentGroup = button.closest('.payments__header-category');
			if (
				Number(parentGroup.dataset.cityIndex) !== currentCityIndex
			) return;

			currentCategoryIndex = Number(button.dataset.categoryIndex);
			updateView();
		});
	});

	updateView();

	window.addEventListener('resize', updateView);
});
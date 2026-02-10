document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('.payments');
	if (!root) return;

	const cityToggle = root.querySelector('.payments__city-toggle');
	const cityToggleText = cityToggle?.querySelector('span');
	const cityDropdown = root.querySelector('.payments__city-dropdown');
	const cityOptions = [...root.querySelectorAll('.payments__city-option')];

	const headerGroups = [...root.querySelectorAll('.payments__header-category')];
	const categoryButtons = [...root.querySelectorAll('.payments__category-button')];
	const categorySections = [...root.querySelectorAll('.payments__category-section')];
	const categoryHeaders = [...root.querySelectorAll('.payments__category-header')];

	const MOBILE_BREAKPOINT = 540;

	let currentCity = null;
	let currentCategory = null;
	let lastIsMobile = isMobile();

	function isMobile() {
		return window.innerWidth <= MOBILE_BREAKPOINT;
	}

	function getFirstCity() {
		const firstOption = cityOptions[0];
		return firstOption ? firstOption.dataset.cityIndex : null;
	}

	function getFirstCategoryForCity(city) {
		const section = categorySections.find(
			s => s.dataset.cityIndex === city
		);
		return section ? section.dataset.categoryIndex : null;
	}

	currentCity = getFirstCity();
	currentCategory = isMobile()
		? null
		: getFirstCategoryForCity(currentCity);

	cityToggle?.addEventListener('click', e => {
		e.stopPropagation();
		cityToggle.classList.toggle('active');
		cityDropdown?.classList.toggle('active');
	});

	document.addEventListener('click', () => {
		cityToggle?.classList.remove('active');
		cityDropdown?.classList.remove('active');
	});

	cityOptions.forEach(option => {
		option.addEventListener('click', e => {
			e.stopPropagation();

			currentCity = option.dataset.cityIndex;
			currentCategory = isMobile()
				? null
				: getFirstCategoryForCity(currentCity);

			cityOptions.forEach(o => o.classList.remove('active'));
			option.classList.add('active');

			if (cityToggleText) {
				cityToggleText.textContent = option.textContent.trim();
			}

			cityToggle?.classList.remove('active');
			cityDropdown?.classList.remove('active');

			updateView();
		});
	});

	categoryButtons.forEach(button => {
		button.addEventListener('click', () => {
			if (isMobile()) return;

			const parent = button.closest('.payments__header-category');
			if (!parent) return;
			if (parent.dataset.cityIndex !== currentCity) return;

			currentCategory = button.dataset.categoryIndex;
			updateView();
		});
	});

	categoryHeaders.forEach(header => {
		header.addEventListener('click', () => {
			if (!isMobile()) return;

			const section = header.closest('.payments__category-section');
			if (!section) return;

			const isOpen = section.classList.contains('is-open');


			categorySections.forEach(s => s.classList.remove('is-open'));

			if (!isOpen) {
				section.classList.add('is-open');
				currentCategory = section.dataset.categoryIndex;
			} else {
				currentCategory = null;
			}
		});
	});

	function updateView() {
		const mobile = isMobile();

		headerGroups.forEach(group => {
			group.classList.toggle(
				'active',
				!mobile && group.dataset.cityIndex === currentCity
			);
		});

		categorySections.forEach(section => {
			const cityMatch = section.dataset.cityIndex === currentCity;
			const categoryMatch =
				section.dataset.categoryIndex === currentCategory;

			section.classList.remove('active', 'is-visible');

			if (mobile) {
				if (cityMatch) {
					section.classList.add('is-visible');
				}
			} else {
				if (cityMatch && categoryMatch) {
					section.classList.add('active');
				}
			}
		});

		if (!mobile) {
			categoryButtons.forEach(button => {
				const parent = button.closest('.payments__header-category');
				if (!parent || parent.dataset.cityIndex !== currentCity) return;

				const isActive =
					button.dataset.categoryIndex === currentCategory;

				button.classList.toggle('btn--primary', isActive);
				button.classList.toggle('btn--outlined', !isActive);
			});
		}
	}

	window.addEventListener('resize', () => {
		const nowIsMobile = isMobile();

		if (nowIsMobile === lastIsMobile) return;

		lastIsMobile = nowIsMobile;

		if (!nowIsMobile && currentCategory === null) {
			currentCategory = getFirstCategoryForCity(currentCity);
		}

		if (nowIsMobile) {
			currentCategory = null;
		}

		updateView();
	});

	updateView();
});
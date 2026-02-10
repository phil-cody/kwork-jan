document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('.payments');
	if (!root) return;

	const cityToggle = root.querySelector('.payments__city-toggle');
	const cityToggleText = cityToggle.querySelector('span');
	const cityDropdown = root.querySelector('.payments__city-dropdown');
	const cityOptions = Array.from(
		root.querySelectorAll('.payments__city-option')
	);

	const headerGroups = root.querySelectorAll('.payments__header-category');
	const categoryButtons = root.querySelectorAll('.payments__category-button');
	const categorySections = Array.from(
		root.querySelectorAll('.payments__category-section')
	);
	const categoryHeaders = root.querySelectorAll('.payments__category-header');

	const MOBILE_BREAKPOINT = 540;

	const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

	function getDefaultCityIndex() {
		const firstCity = cityOptions[0];
		return firstCity ? Number(firstCity.dataset.cityIndex) : null;
	}

	function getFirstCategoryIndexForCity(cityIndex) {
		const section = categorySections.find(
			sec => Number(sec.dataset.cityIndex) === cityIndex
		);
		return section ? Number(section.dataset.categoryIndex) : null;
	}

	let currentCityIndex = getDefaultCityIndex();
	let currentCategoryIndex = isMobile()
		? null
		: getFirstCategoryIndexForCity(currentCityIndex);
	let lastIsMobile = isMobile();

	cityToggle.addEventListener('click', e => {
		e.stopPropagation();
		cityToggle.classList.toggle('active');
		cityDropdown.classList.toggle('active');
	});

	document.addEventListener('click', () => {
		cityToggle.classList.remove('active');
		cityDropdown.classList.remove('active');
	});

	cityOptions.forEach(option => {
		option.addEventListener('click', e => {
			e.stopPropagation();

			currentCityIndex = Number(option.dataset.cityIndex);
			if (!isMobile()) {
				currentCategoryIndex =
					getFirstCategoryIndexForCity(currentCityIndex);
			}

			cityOptions.forEach(o => o.classList.remove('active'));
			option.classList.add('active');

			cityToggleText.textContent = option.textContent;
			cityToggle.classList.remove('active');
			cityDropdown.classList.remove('active');

			updateView();
		});
	});

	categoryButtons.forEach(button => {
		button.addEventListener('click', () => {
			if (isMobile()) return;

			const group = button.closest('.payments__header-category');
			if (!group) return;

			if (Number(group.dataset.cityIndex) !== currentCityIndex) return;

			currentCategoryIndex = Number(button.dataset.categoryIndex);
			updateView();
		});
	});

	categoryHeaders.forEach(header => {
		header.addEventListener('click', () => {
			if (!isMobile()) return;

			const section = header.closest('.payments__category-section');
			if (!section) return;

			const isOpen = section.classList.contains('is-open');
			categorySections.forEach(sec => {
				if (sec !== section) sec.classList.remove('is-open');
			});

			if (!isOpen) {
				section.classList.add('is-open');
				currentCategoryIndex = Number(section.dataset.categoryIndex);
			} else {
				section.classList.remove('is-open');
				currentCategoryIndex = null;
			}
		});
	});

	function updateView() {
		const mobile = isMobile();
		headerGroups.forEach(group => {
			group.classList.toggle(
				'active',
				!mobile && Number(group.dataset.cityIndex) === currentCityIndex
			);
		});
		categorySections.forEach(section => {
			const cityMatch =
				Number(section.dataset.cityIndex) === currentCityIndex;
			const categoryMatch =
				Number(section.dataset.categoryIndex) === currentCategoryIndex;
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
				const group = button.closest('.payments__header-category');
				if (
					!group ||
					Number(group.dataset.cityIndex) !== currentCityIndex
				) return;

				button.classList.toggle(
					'btn--primary',
					Number(button.dataset.categoryIndex) === currentCategoryIndex
				);
				button.classList.toggle(
					'btn--outlined',
					Number(button.dataset.categoryIndex) !== currentCategoryIndex
				);
			});
		}
	}

	if (cityOptions[0]) {
		cityOptions[0].classList.add('active');
		cityToggleText.textContent = cityOptions[0].textContent;
	}

	updateView();

	window.addEventListener('resize', () => {
		const nowIsMobile = isMobile();
		if (nowIsMobile === lastIsMobile) return;

		lastIsMobile = nowIsMobile;

		if (!nowIsMobile) {
			currentCategoryIndex =
				getFirstCategoryIndexForCity(currentCityIndex);
		} else {
			currentCategoryIndex = null;
		}

		updateView();
	});
});
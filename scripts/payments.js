document.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('.payments');
	if (!root) return;

	/* ===== DOM ===== */

	const cityToggle = root.querySelector('.payments__city-toggle');
	const cityToggleText = cityToggle.querySelector('span');
	const cityDropdown = root.querySelector('.payments__city-dropdown');
	const cityOptions = root.querySelectorAll('.payments__city-option');

	const headerGroups = root.querySelectorAll('.payments__header-category');
	const categoryButtons = root.querySelectorAll('.payments__category-button');
	const categorySections = root.querySelectorAll('.payments__category-section');
	const categoryHeaders = root.querySelectorAll('.payments__category-header');

	/* ===== CONST ===== */

	const MOBILE_BREAKPOINT = 540;

	/* ===== STATE ===== */

	let currentCityIndex = 0;
	let currentCategoryIndex = null; // null = ничего не выбрано (mobile)

	/* ===== HELPERS ===== */

	function isMobile() {
		return window.innerWidth <= MOBILE_BREAKPOINT;
	}

	function findFirstCategoryIndexForCity(cityIndex) {
		const section = Array.from(categorySections).find(
			sec => Number(sec.dataset.cityIndex) === cityIndex
		);
		return section ? Number(section.dataset.categoryIndex) : null;
	}

	/* ===== CITY DROPDOWN ===== */

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
			currentCategoryIndex = isMobile()
				? null
				: findFirstCategoryIndexForCity(currentCityIndex);

			cityOptions.forEach(o => o.classList.remove('active'));
			option.classList.add('active');

			cityToggleText.textContent = option.textContent;
			cityToggle.classList.remove('active');
			cityDropdown.classList.remove('active');

			updateView();
		});
	});

	/* ===== DESKTOP CATEGORY BUTTONS ===== */

	categoryButtons.forEach(button => {
		button.addEventListener('click', () => {
			if (isMobile()) return;

			const parentGroup = button.closest('.payments__header-category');
			if (!parentGroup) return;

			if (Number(parentGroup.dataset.cityIndex) !== currentCityIndex) return;

			currentCategoryIndex = Number(button.dataset.categoryIndex);
			updateView();
		});
	});

	/* ===== MOBILE ACCORDION ===== */

	categoryHeaders.forEach(header => {
		header.addEventListener('click', () => {
			if (!isMobile()) return;

			const section = header.closest('.payments__category-section');
			if (!section) return;

			const isOpen = section.classList.contains('is-open');

			// закрываем все
			categorySections.forEach(sec => sec.classList.remove('is-open'));

			// если был закрыт — открываем
			if (!isOpen) {
				section.classList.add('is-open');
				currentCategoryIndex = Number(section.dataset.categoryIndex);
			} else {
				currentCategoryIndex = null;
			}
		});
	});

	/* ===== VIEW UPDATE ===== */

	function updateView() {
		const mobile = isMobile();

		/* header categories (desktop only) */
		headerGroups.forEach(group => {
			group.classList.toggle(
				'active',
				!mobile && Number(group.dataset.cityIndex) === currentCityIndex
			);
		});

		/* sections */
		categorySections.forEach(section => {
			const cityMatch =
				Number(section.dataset.cityIndex) === currentCityIndex;
			const categoryMatch =
				Number(section.dataset.categoryIndex) === currentCategoryIndex;

			section.classList.remove('active', 'is-visible', 'is-open');

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

		/* desktop buttons */
		if (!mobile) {
			categoryButtons.forEach(button => {
				const parentGroup = button.closest('.payments__header-category');
				if (
					!parentGroup ||
					Number(parentGroup.dataset.cityIndex) !== currentCityIndex
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

	/* ===== INIT ===== */

	currentCategoryIndex = isMobile()
		? null
		: findFirstCategoryIndexForCity(currentCityIndex);

	updateView();

	window.addEventListener('resize', () => {
		const wasMobile = currentCategoryIndex === null && !isMobile();

		if (!isMobile() && currentCategoryIndex === null) {
			currentCategoryIndex = findFirstCategoryIndexForCity(currentCityIndex);
		}

		if (isMobile()) {
			currentCategoryIndex = null;
		}

		updateView();
	});
});
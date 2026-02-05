document.addEventListener('DOMContentLoaded', () => {
	const STORAGE_KEY = 'cookieBannerClosed';
	const VISIBLE_CLASS = 'cookie-banner--visible';
	const ANIMATION_DURATION = 300; // должно совпадать с CSS

	const banner = document.querySelector('.cookie-banner');
	if (!banner) return;

	const acceptButton = banner.querySelector('.cookie-banner__button');
	const isClosed = localStorage.getItem(STORAGE_KEY) === 'true';

	if (!isClosed) {
		showBanner();
	}

	if (acceptButton) {
		acceptButton.addEventListener('click', closeBanner);
	}

	function showBanner() {
		setTimeout(() => {
			banner.classList.add(VISIBLE_CLASS);
		}, 1000);
	}

	function closeBanner() {
		banner.classList.remove(VISIBLE_CLASS);
		localStorage.setItem(STORAGE_KEY, 'true');

		setTimeout(() => {
			banner.remove();
		}, ANIMATION_DURATION);
	}
});